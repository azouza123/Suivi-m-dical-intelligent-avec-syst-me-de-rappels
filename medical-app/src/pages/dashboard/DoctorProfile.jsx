import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/authSlice'
import {
  User, Mail, Lock, Shield, Pencil, X,
  Check, Loader2, Eye, EyeOff
} from 'lucide-react'

const DoctorProfile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [editing, setEditing] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [showOldPwd, setShowOldPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const [pwdData, setPwdData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DR'

  const handleSaveProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      // Update profile via API (add this endpoint to your backend)
      // const response = await api.put('/auth/profile', formData)
      // For now update Redux state directly
      dispatch(loginSuccess({
        user: { ...user, name: formData.name, email: formData.email },
        token: localStorage.getItem('token'),
      }))
      setSuccess('Profil mis à jour avec succès')
      setEditing(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (e) {
      setError('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (pwdData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Add this endpoint to your backend: PUT /auth/change-password
      // await api.put('/auth/change-password', { oldPassword: pwdData.oldPassword, newPassword: pwdData.newPassword })
      setSuccess('Mot de passe modifié avec succès')
      setChangingPassword(false)
      setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(null), 3000)
    } catch (e) {
      setError('Ancien mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"

  return (
    <div className="w-full space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mon Profil</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
          <Check size={16} />
          {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

        {/* Purple banner */}
        <div
          className="h-28 w-full"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 50%, #9333ea 100%)' }}
        />

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-5">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {initials}
              </span>
            </div>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setError(null) }}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Pencil size={14} />
                Modifier le profil
              </button>
            )}
          </div>

          {!editing ? (
            /* View mode */
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield size={13} className="text-purple-500" />
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Médecin</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={14} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Rôle</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Médecin</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit mode */
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Modifier les informations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`${inputClass} pl-9`}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`${inputClass} pl-9`}
                      placeholder="Votre email"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Enregistrer
                </button>
                <button
                  onClick={() => { setEditing(false); setError(null); setFormData({ name: user?.name || '', email: user?.email || '' }) }}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <X size={14} />
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change password card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Lock size={16} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Sécurité</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Modifier votre mot de passe</p>
            </div>
          </div>
          {!changingPassword && (
            <button
              onClick={() => { setChangingPassword(true); setError(null) }}
              className="text-sm text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
              Changer le mot de passe
            </button>
          )}
        </div>

        {changingPassword && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Ancien mot de passe
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showOldPwd ? 'text' : 'password'}
                  value={pwdData.oldPassword}
                  onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                  className={`${inputClass} pl-9 pr-10`}
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowOldPwd(!showOldPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={pwdData.newPassword}
                    onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                    className={`${inputClass} pl-9 pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={pwdData.confirmPassword}
                    onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                    className={`${inputClass} pl-9`}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Password strength indicator */}
            {pwdData.newPassword && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        pwdData.newPassword.length >= i * 2
                          ? pwdData.newPassword.length >= 8
                            ? 'bg-green-500'
                            : pwdData.newPassword.length >= 4
                            ? 'bg-orange-400'
                            : 'bg-red-400'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  {pwdData.newPassword.length < 4 ? 'Trop court' :
                   pwdData.newPassword.length < 8 ? 'Moyen' : 'Fort'}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleChangePassword}
                disabled={loading || !pwdData.oldPassword || !pwdData.newPassword}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Modifier le mot de passe
              </button>
              <button
                onClick={() => { setChangingPassword(false); setError(null); setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' }) }}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <X size={14} />
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account info card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Informations du compte
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">ID utilisateur</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">#{user?.id}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Rôle</p>
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">Médecin</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Statut</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">Actif</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DoctorProfile