import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import { Heart, Users, User, LogOut, Sun, Moon, MessageCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const DoctorLayout = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { dark, toggle } = useTheme()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isOnProfile = location.pathname === '/doctor/profile'
  const isOnChat = location.pathname === '/doctor/chat'

  const navBtn = (path, label, Icon, active) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  )

  return (
    <div
      className="flex flex-col bg-gray-50 dark:bg-gray-950"
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      {/* Top Navbar */}
      <header
        className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-shrink-0"
        style={{ height: '56px', paddingLeft: '24px', paddingRight: '24px' }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/doctor')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart size={16} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">MediTrack</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Espace Médecin</p>
          </div>
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-2">

          {/* Mes Patients */}
          <button
            onClick={() => navigate('/doctor')}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              !isOnProfile && !isOnChat
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Users size={15} />
            Mes Patients
          </button>

          {/* Messagerie */}
          <button
            onClick={() => navigate('/doctor/chat')}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              isOnChat
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <MessageCircle size={15} />
            Messagerie
          </button>

          {/* Profil */}
          <button
            onClick={() => navigate('/doctor/profile')}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              isOnProfile
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <User size={15} />
            Profil
          </button>

          {/* Dark mode */}
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </div>
  )
}

export default DoctorLayout