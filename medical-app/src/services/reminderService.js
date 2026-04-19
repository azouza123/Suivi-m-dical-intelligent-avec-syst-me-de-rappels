import api from './api'

const reminderService = {
  getAll: () => api.get('/reminders'),
  getHistory: () => api.get('/reminders/history'),
  generate: () => api.post('/reminders/generate'),
  markTaken: (id, value) => api.put(`/reminders/${id}/taken?value=${value}`),
}

export default reminderService