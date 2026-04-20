import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import DoctorLayout from '../components/layout/DoctorLayout'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Patient pages
import DashboardPage from '../pages/dashboard/DashboardPage'
import MedicationsPage from '../pages/medications/MedicationsPage'
import MeasuresPage from '../pages/measures/MeasuresPage'
import RemindersPage from '../pages/reminders/RemindersPage'
import StatsPage from '../pages/stats/StatsPage'
import PatientChat from '../pages/chat/PatientChat'

// Doctor pages
import DoctorDashboard from '../pages/dashboard/DoctorDashboard'
import DoctorProfile from '../pages/dashboard/DoctorProfile'
import DoctorChat from '../pages/chat/DoctorChat'

// Protected route for patients
const PatientRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const { user } = useSelector((state) => state.auth)
  if (!token) return <Navigate to="/login" replace />
  if (user?.role === 'DOCTOR') return <Navigate to="/doctor" replace />
  return <MainLayout>{children}</MainLayout>
}

// Protected route for doctors
const DoctorRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const { user } = useSelector((state) => state.auth)
  if (!token) return <Navigate to="/login" replace />
  if (user?.role === 'PATIENT') return <Navigate to="/dashboard" replace />
  return <DoctorLayout>{children}</DoctorLayout>
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient routes */}
        <Route path="/dashboard"   element={<PatientRoute><DashboardPage /></PatientRoute>} />
        <Route path="/medications" element={<PatientRoute><MedicationsPage /></PatientRoute>} />
        <Route path="/measures"    element={<PatientRoute><MeasuresPage /></PatientRoute>} />
        <Route path="/reminders"   element={<PatientRoute><RemindersPage /></PatientRoute>} />
        <Route path="/stats"       element={<PatientRoute><StatsPage /></PatientRoute>} />
        <Route path="/chat"        element={<PatientRoute><PatientChat /></PatientRoute>} />

        {/* Doctor routes */}
        <Route path="/doctor"         element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
        <Route path="/doctor/profile" element={<DoctorRoute><DoctorProfile /></DoctorRoute>} />
        <Route path="/doctor/chat"    element={<DoctorRoute><DoctorChat /></DoctorRoute>} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter