import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard, Pill, Activity,
  Bell, BarChart2, LogOut, Heart, MessageCircle,
} from 'lucide-react'
import { logout } from '../../store/authSlice'

const navItems = [
  { path: '/dashboard',   label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/medications', label: 'Médicaments',    icon: Pill },
  { path: '/measures',    label: 'Mesures',        icon: Activity },
  { path: '/reminders',   label: 'Rappels',        icon: Bell },
  { path: '/stats',       label: 'Statistiques',   icon: BarChart2 },
  { path: '/chat',        label: 'Mon Médecin',    icon: MessageCircle },
]

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart size={16} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">MediTrack</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Suivi médical intelligent</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        <div className="space-y-0.5">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User area */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{user?.name || 'Utilisateur'}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Patient</p>
          </div>
          <button
            onClick={handleLogout}
            title="Déconnexion"
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar