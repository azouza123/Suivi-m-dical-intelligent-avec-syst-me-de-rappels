import api from './api'

const measureService = {
  getAll: () => api.get('/measures'),
  create: (data) => api.post('/measures', data),
  delete: (id) => api.delete(`/measures/${id}`),
}

export default measureService