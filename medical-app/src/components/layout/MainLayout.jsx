import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar gauche */}
            <Sidebar />

            {/* Contenu principal */}
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