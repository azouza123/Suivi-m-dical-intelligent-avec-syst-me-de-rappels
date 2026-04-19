import Sidebar from './Sidebar'
import DoctorSidebar from './DoctorSidebar'
import Navbar from './Navbar'

const MainLayout = ({ children, role }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {role === 'doctor' ? <DoctorSidebar /> : <Sidebar />}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout