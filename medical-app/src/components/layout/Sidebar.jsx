import {
    LayoutDashboard,
    Pill,
    Activity,
    Bell,
    BarChart2,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/medications', label: 'Médicaments', icon: Pill },
    { path: '/measures', label: 'Mesures', icon: Activity },
    { path: '/reminders', label: 'Rappels', icon: Bell },
    { path: '/stats', label: 'Statistiques', icon: BarChart2 },
]

const Sidebar = () => {
    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600">🏥 MediTrack</h1>
                <p className="text-xs text-gray-400 mt-1">Suivi médical intelligent</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`
                }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

        </aside>
    )
}

export default Sidebar