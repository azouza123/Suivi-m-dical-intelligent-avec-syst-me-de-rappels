import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import MedicationsPage from '../pages/medications/MedicationsPage'
import MeasuresPage from '../pages/measures/MeasuresPage'
import RemindersPage from '../pages/reminders/RemindersPage'
import StatsPage from '../pages/stats/StatsPage'
import DoctorSharePage from '../pages/doctor/DoctorSharePage'

import DoctorDashboardPage from '../pages/doctor/DoctorDashboardPage'
import DoctorPatientDetailPage from '../pages/doctor/DoctorPatientDetailPage'

// Route protégée patient
const PatientRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (!token) return <Navigate to="/login" replace />
  if (role === 'doctor') return <Navigate to="/doctor/dashboard" replace />
  return <MainLayout>{children}</MainLayout>
}

// Route protégée médecin
const DoctorRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'doctor') return <Navigate to="/dashboard" replace />
  return <MainLayout role="doctor">{children}</MainLayout>
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes patient */}
        <Route path="/dashboard" element={<PatientRoute><DashboardPage /></PatientRoute>} />
        <Route path="/medications" element={<PatientRoute><MedicationsPage /></PatientRoute>} />
        <Route path="/measures" element={<PatientRoute><MeasuresPage /></PatientRoute>} />
        <Route path="/reminders" element={<PatientRoute><RemindersPage /></PatientRoute>} />
        <Route path="/stats" element={<PatientRoute><StatsPage /></PatientRoute>} />
        <Route path="/doctor" element={<PatientRoute><DoctorSharePage /></PatientRoute>} />

        {/* Routes médecin */}
        <Route path="/doctor/dashboard" element={<DoctorRoute><DoctorDashboardPage /></DoctorRoute>} />
        <Route path="/doctor/patient/:patientId" element={<DoctorRoute><DoctorPatientDetailPage /></DoctorRoute>} />

        {/* Redirections */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter