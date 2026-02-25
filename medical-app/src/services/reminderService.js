import api from './api'

const reminderService = {
  getAll: () => api.get('/reminders'),
  getHistory: () => api.get('/reminders/history'),
}

export default reminderService