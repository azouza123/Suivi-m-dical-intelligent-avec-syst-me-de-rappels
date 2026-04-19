import Sidebar from './Sidebar'
import Navbar from './Navbar'

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout