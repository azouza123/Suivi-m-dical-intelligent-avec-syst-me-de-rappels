import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL de votre backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Intercepteur REQUEST ───────────────────────────────────
// Ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Intercepteur RESPONSE ──────────────────────────────────
// Gère les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide → déconnexion automatique
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api