import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Send, Loader2, MessageCircle,
  CheckCheck, Circle, Wifi, WifiOff, Stethoscope, Paperclip, X
} from 'lucide-react'
import chatService from '../../services/chatService'
import useWebSocket from '../../hooks/useWebSocket'
import api from '../../services/api'
import { setMessages, addMessage, setDoctor } from '../../store/chatSlice'
import FileMessage from '../../components/common/FileMessage'

const buildConvId = (id1, id2) =>
  `${Math.min(Number(id1), Number(id2))}_${Math.max(Number(id1), Number(id2))}`

const PatientChat = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { messages: allMessages, doctor: reduxDoctor } = useSelector((state) => state.chat)

  const [loadingDoctor, setLoadingDoctor] = useState(!reduxDoctor)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Debounced online status — prevents flicker during page reload
  const [showOnline, setShowOnline] = useState(false)
  const offlineTimerRef = useRef(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const subscribedRef = useRef(false)

  const doctor = reduxDoctor

  const conversationId = doctor && user ? buildConvId(user.id, doctor.id) : null
  const messages = conversationId ? (allMessages[conversationId] || []) : []
  const validMessages = messages.filter(m => m != null && m.id != null)

  const handleIncomingMessage = useCallback((message) => {
    if (!message || !message.id) return
    const convId = buildConvId(message.senderId, message.receiverId)
    dispatch(addMessage({ conversationId: convId, message }))
  }, [dispatch])

  const { connected, sendMessage, subscribeToConversation } =
    useWebSocket(user?.id, handleIncomingMessage)

  // Debounce offline status — wait 4 seconds before showing offline
  useEffect(() => {
    if (connected) {
      clearTimeout(offlineTimerRef.current)
      setShowOnline(true)
    } else {
      offlineTimerRef.current = setTimeout(() => setShowOnline(false), 4000)
    }
    return () => clearTimeout(offlineTimerRef.current)
  }, [connected])

  useEffect(() => {
    if (reduxDoctor) {
      if (conversationId && !allMessages[conversationId]) {
        setLoadingMessages(true)
        chatService.getConversation(reduxDoctor.id)
          .then((r) => {
            const valid = (r.data || []).filter(m => m != null && m.id != null)
            dispatch(setMessages({ conversationId, messages: valid }))
          })
          .catch(console.error)
          .finally(() => setLoadingMessages(false))
      }
      return
    }

    setLoadingDoctor(true)
    api.get('/patient/doctor')
      .then((r) => {
        const doc = r.data
        dispatch(setDoctor(doc))
        const convId = buildConvId(user.id, doc.id)
        if (!allMessages[convId]) {
          setLoadingMessages(true)
          return chatService.getConversation(doc.id)
            .then((r2) => {
              const valid = (r2.data || []).filter(m => m != null && m.id != null)
              dispatch(setMessages({ conversationId: convId, messages: valid }))
            })
        }
      })
      .catch(console.error)
      .finally(() => { setLoadingDoctor(false); setLoadingMessages(false) })
  }, [])

  useEffect(() => {
    if (connected && doctor?.id && !subscribedRef.current) {
      subscribeToConversation(doctor.id)
      subscribedRef.current = true
    }
  }, [connected, doctor?.id])

  useEffect(() => { if (!connected) subscribedRef.current = false }, [connected])
  useEffect(() => { return () => { subscribedRef.current = false } }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [validMessages.length])

  const handleSend = () => {
    if (!newMessage.trim() || !doctor || !connected) return
    sendMessage('/app/chat.send', {
      senderId: user.id, senderName: user.name, senderRole: 'PATIENT',
      receiverId: doctor.id, receiverName: doctor.name, content: newMessage.trim(),
    })
    setNewMessage('')
    inputRef.current?.focus()
  }

  const handleFileSelect = (e) => { const file = e.target.files[0]; if (!file) return; setSelectedFile(file) }

  const handleFileUpload = async () => {
    if (!selectedFile || !doctor) return
    setUploading(true)
    try {
      await chatService.uploadFile(selectedFile, doctor.id, doctor.name, user.name, 'PATIENT')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (e) { alert('Erreur lors de l\'envoi du fichier') }
    finally { setUploading(false) }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    try { return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    catch { return '' }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Messages'
    try {
      const date = new Date(timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
      if (date.toDateString() === yesterday.toDateString()) return 'Hier'
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    } catch { return 'Messages' }
  }

  const groupedMessages = validMessages.reduce((groups, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) groups[date] = []
    groups[date].push(message)
    return groups
  }, {})

  const doctorName = doctor?.name?.startsWith('Dr.') ? doctor.name : `Dr. ${doctor?.name || ''}`

  if (loadingDoctor) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mon Médecin</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Communiquez avec votre médecin en temps réel</p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
          showOnline ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          {showOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          {showOnline ? 'En ligne' : 'Hors ligne'}
        </div>
      </div>

      {!doctor ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
          <Stethoscope size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Aucun médecin assigné</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
          style={{ height: 'calc(100vh - 200px)' }}>

          {/* Doctor header */}
          <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <Stethoscope size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{doctorName}</p>
              <p className="text-xs text-gray-400">Votre médecin traitant</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${showOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-400">{showOnline ? 'En ligne' : 'Hors ligne'}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 size={24} className="animate-spin text-blue-500" />
              </div>
            ) : validMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageCircle size={32} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">Aucun message</p>
                <p className="text-xs text-gray-300 mt-1">Envoyez un message à votre médecin</p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                    <span className="text-xs text-gray-400 px-2">{date}</span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                  </div>
                  <div className="space-y-2">
                    {msgs.map((msg) => {
                      if (!msg?.id) return null
                      const isMe = Number(msg.senderId) === Number(user?.id)
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-xs lg:max-w-md xl:max-w-lg">
                            {!isMe && <p className="text-xs text-gray-400 mb-1 ml-1">{doctorName}</p>}
                            {msg.messageType === 'FILE' ? (
                              <FileMessage msg={msg} isMe={isMe} />
                            ) : (
                              <div className={`px-4 py-2.5 rounded-2xl ${
                                isMe ? 'bg-blue-600 text-white rounded-tr-sm'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-sm'
                              }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                              </div>
                            )}
                            <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                              {isMe && (msg.read ? <CheckCheck size={12} className="text-blue-500" /> : <Circle size={10} className="text-gray-300" />)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* File preview */}
          {selectedFile && (
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/20 flex items-center gap-3">
              <Paperclip size={14} className="text-blue-500 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300 flex-1 truncate">{selectedFile.name}</p>
              <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
              <button onClick={handleFileUpload} disabled={uploading}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg disabled:opacity-50 flex items-center gap-1">
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Envoyer
              </button>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-end gap-2">
              <button onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors flex-shrink-0">
                <Paperclip size={16} />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" />
              <textarea ref={inputRef} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={connected ? "Écrivez votre message..." : "Connexion en cours..."}
                rows={1} disabled={!connected}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors disabled:opacity-50"
                style={{ minHeight: '42px', maxHeight: '120px' }} />
              <button onClick={handleSend} disabled={!newMessage.trim() || !connected}
                className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors flex-shrink-0">
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 ml-12">Entrée pour envoyer • 📎 pour joindre un fichier</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientChat