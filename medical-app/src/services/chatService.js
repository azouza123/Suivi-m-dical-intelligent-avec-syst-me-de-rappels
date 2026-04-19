import api from './api'

const chatService = {
  getConversation: (otherUserId) => api.get(`/chat/${otherUserId}`),
  markAsRead: (senderId) => api.put(`/chat/${senderId}/read`),
  getUnreadCount: () => api.get('/chat/unread/count'),

  // Upload a file as a message
  uploadFile: (file, receiverId, receiverName, senderName, senderRole) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('receiverId', receiverId)
    formData.append('receiverName', receiverName)
    formData.append('senderName', senderName)
    formData.append('senderRole', senderRole)
    return api.post('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Get file download URL
  getFileUrl: (fileUrl) => `http://localhost:8081${fileUrl}`,
}

export default chatService