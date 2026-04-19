import api from './api'

const medicationService = {
  getAll: () => api.get('/medications'),
  create: (data) => api.post('/medications', data),
  update: (id, data) => api.put(`/medications/${id}`, data),
  delete: (id) => api.delete(`/medications/${id}`),
}

export default medicationService


/*
// Exemple dans un composant
import medicationService from '../services/medicationService'

const response = await medicationService.getAll()
console.log(response.data)
*/
