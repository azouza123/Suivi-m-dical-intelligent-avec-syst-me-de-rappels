import api from './api'

const doctorService = {
  getPatients: () => api.get('/doctor/patients'),
  getPatient: (id) => api.get(`/doctor/patients/${id}`),
  getPatientMedications: (id) => api.get(`/doctor/patients/${id}/medications`),
  getPatientMeasures: (id) => api.get(`/doctor/patients/${id}/measures`),
  prescribeMedication: (id, data) => api.post(`/doctor/patients/${id}/medications`, data),
  deleteMedication: (patientId, medId) => api.delete(`/doctor/patients/${patientId}/medications/${medId}`),
}

export default doctorService