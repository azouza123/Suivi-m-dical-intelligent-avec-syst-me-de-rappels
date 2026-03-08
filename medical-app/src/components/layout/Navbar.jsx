import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/authSlice"
import { useNavigate } from "react-router-dom"
import { LogOut, User } from "lucide-react"

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

            {/* Titre page */}
            <h2 className="text-lg font-semibold text-gray-700">
                Bienvenue 👋
            </h2>

            {/* Utilisateur + Déconnexion */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <span>{user?.name || 'Utilisateur'}</span>
                </div>
                <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                    <LogOut size={16} />
                    Déconnexion
                </button>
            </div>

        </header>
    )
}

export default Navbar