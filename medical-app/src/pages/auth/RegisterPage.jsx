import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Mail, Lock, User, Loader2, Sun, Moon } from 'lucide-react'
import authService from '../../services/authService'
import { useTheme } from '../../context/ThemeContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    try {
      await authService.register({ name: formData.name, email: formData.email, password: formData.password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
  const labelClass = "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 relative">

      <button
        onClick={toggle}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Heart size={24} className="text-white" fill="white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Créer un compte</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Rejoignez MediTrack en tant que patient</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Nom complet</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Jean Dupont" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Adresse email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="exemple@email.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" className={inputClass} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Inscription...</> : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-5">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage