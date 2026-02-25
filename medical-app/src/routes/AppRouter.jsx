import { BrowserRouter,Routes, Navigate, Route } from "react-router-dom"
import LoginPage from "../pages/auth/LoginPage"
import DashboardPage from "../pages/dashboard/DashboardPage"
import { Children } from "react"

// Composant qui protège les routes privées
const ProtectedRoute = ({ Children }) => {
    const token = localStorage.getItem('token')
    return token ? Children : <Navigate to="/login" replace />
}

const AppRouter = () => {
    return (
        <BrowserRouter>
        <Routes>

            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />

            {/* Routes protégées */}
            <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />

            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
        </BrowserRouter>
    )
}

export default AppRouter