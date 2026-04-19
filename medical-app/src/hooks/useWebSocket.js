import { useEffect, useRef, useState, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

const useWebSocket = (userId, onMessageReceived) => {
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const onMessageRef = useRef(onMessageReceived)
  const subscriptionsRef = useRef({})

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

      reconnectDelay: 5000,
    })

    client.activate()
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
        clientRef.current = null
        subscriptionsRef.current = {}
      }
    }
  }, [userId])

  // Subscribe to a conversation topic between two users
  const subscribeToConversation = useCallback((otherUserId) => {
    if (!clientRef.current?.connected || !userId || !otherUserId) return

    // Build same topic as server: smaller id first
    const id1 = Math.min(Number(userId), Number(otherUserId))
    const id2 = Math.max(Number(userId), Number(otherUserId))
    const topic = `/topic/chat.${id1}.${id2}`

    // Already subscribed to this topic
    if (subscriptionsRef.current[topic]) return

    console.log('Subscribing to topic:', topic)

    const subscription = clientRef.current.subscribe(topic, (message) => {
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
  }, [userId])

  // Unsubscribe from a conversation topic
  const unsubscribeFromConversation = useCallback((otherUserId) => {
    if (!userId || !otherUserId) return
    const id1 = Math.min(Number(userId), Number(otherUserId))
    const id2 = Math.max(Number(userId), Number(otherUserId))
    const topic = `/topic/chat.${id1}.${id2}`

    if (subscriptionsRef.current[topic]) {
      subscriptionsRef.current[topic].unsubscribe()
      delete subscriptionsRef.current[topic]
    }
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