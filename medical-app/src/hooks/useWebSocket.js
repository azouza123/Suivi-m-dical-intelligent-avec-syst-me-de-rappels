import { useEffect, useRef, useState, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

const useWebSocket = (userId, onMessageReceived) => {
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const onMessageRef = useRef(onMessageReceived)
  const subscriptionsRef = useRef({})
  const pendingSubscriptionsRef = useRef([]) // ← stores topics to subscribe after connect

  useEffect(() => {
    onMessageRef.current = onMessageReceived
  }, [onMessageReceived])

  useEffect(() => {
    if (!userId) return
    if (clientRef.current) return

    const token = localStorage.getItem('token')

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        setConnected(true)
        console.log('WebSocket connected for user:', userId)

        // Re-subscribe to all pending topics after reconnect
        pendingSubscriptionsRef.current.forEach((otherUserId) => {
          doSubscribe(client, userId, otherUserId)
        })
      },
      onDisconnect: () => {
        setConnected(false)
        subscriptionsRef.current = {}
        console.log('WebSocket disconnected')
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
        setConnected(false)
      },
      reconnectDelay: 1000, // ← faster reconnect
    })

    client.activate()
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
        clientRef.current = null
        subscriptionsRef.current = {}
        pendingSubscriptionsRef.current = []
      }
    }
  }, [userId])

  const doSubscribe = (client, userId, otherUserId) => {
    const id1 = Math.min(Number(userId), Number(otherUserId))
    const id2 = Math.max(Number(userId), Number(otherUserId))
    const topic = `/topic/chat.${id1}.${id2}`

    if (subscriptionsRef.current[topic]) return

    console.log('Subscribing to topic:', topic)
    const subscription = client.subscribe(topic, (message) => {
      try {
        const parsed = JSON.parse(message.body)
        console.log('Received real-time message:', parsed)
        if (onMessageRef.current) {
          onMessageRef.current(parsed)
        }
      } catch (e) {
        console.error('Error parsing message:', e)
      }
    })
    subscriptionsRef.current[topic] = subscription
  }

  const subscribeToConversation = useCallback((otherUserId) => {
    if (!userId || !otherUserId) return

    // Always save to pending so we can re-subscribe after reconnect
    if (!pendingSubscriptionsRef.current.includes(otherUserId)) {
      pendingSubscriptionsRef.current.push(otherUserId)
    }

    // Subscribe immediately if already connected
    if (clientRef.current?.connected) {
      doSubscribe(clientRef.current, userId, otherUserId)
    }
  }, [userId])

  const unsubscribeFromConversation = useCallback((otherUserId) => {
    if (!userId || !otherUserId) return
    const id1 = Math.min(Number(userId), Number(otherUserId))
    const id2 = Math.max(Number(userId), Number(otherUserId))
    const topic = `/topic/chat.${id1}.${id2}`

    if (subscriptionsRef.current[topic]) {
      subscriptionsRef.current[topic].unsubscribe()
      delete subscriptionsRef.current[topic]
    }

    // Remove from pending
    pendingSubscriptionsRef.current = pendingSubscriptionsRef.current.filter(
      id => id !== otherUserId
    )
  }, [userId])

  const sendMessage = useCallback((destination, body) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      })
      return true
    }
    console.warn('WebSocket not connected')
    return false
  }, [])

  return { connected, sendMessage, subscribeToConversation, unsubscribeFromConversation }
}

export default useWebSocket