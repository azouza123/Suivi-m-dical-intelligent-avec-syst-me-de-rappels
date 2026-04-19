import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: {},        // { "convId": [...messages] }
    selectedPatientId: null,
    doctor: null,
  },
  reducers: {
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload
      state.messages[conversationId] = messages
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = []
      }
      const exists = state.messages[conversationId].find(m => m && m.id === message.id)
      if (!exists) {
        state.messages[conversationId].push(message)
      }
    },
    setSelectedPatientId: (state, action) => {
      state.selectedPatientId = action.payload
    },
    setDoctor: (state, action) => {
      state.doctor = action.payload
    },
    clearChat: (state) => {
      state.messages = {}
      state.selectedPatientId = null
      state.doctor = null
    },
  },
})

export const { setMessages, addMessage, setSelectedPatientId, setDoctor, clearChat } = chatSlice.actions
export default chatSlice.reducer