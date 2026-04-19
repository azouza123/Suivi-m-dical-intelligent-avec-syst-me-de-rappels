import { useLocation } from 'react-router-dom'
import { Sun, Moon, Bell } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const PAGE_TITLES = {
  '/dashboard':   'Tableau de bord',
  '/medications': 'Médicaments',
  '/measures':    'Mesures médicales',
  '/reminders':   'Rappels',
  '/stats':       'Statistiques',
}

const Navbar = () => {
  const { dark, toggle } = useTheme()
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'MediTrack'

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Capitalize first letter
  const dateLabel = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 flex-shrink-0">

      {/* Left — page title */}
      <div>
        <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500">{dateLabel}</p>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={dark ? 'Mode clair' : 'Mode sombre'}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notification bell */}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

      </div>
    </header>
  )
}

export default Navbar