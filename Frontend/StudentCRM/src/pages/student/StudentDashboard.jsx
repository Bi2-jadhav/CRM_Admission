import { useState } from 'react'
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Home, Calendar, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../Components/context/AuthContext'

import StudentHome from './StudentHome'

function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout, authReady } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!authReady) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname.includes(path)

  return (
    <div className="flex h-screen bg-gray-100">

  {/* SIDEBAR */}
  <aside className={`bg-blue-700 text-white transition-all duration-300 
    ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}>

    <div className="flex items-center justify-between p-4 border-b border-blue-500">
      <h2 className={`font-bold text-lg ${!sidebarOpen && "hidden"}`}>Student</h2>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X /> : <Menu />}
      </button>
    </div>

    <nav className="flex-1 p-2 space-y-2">

      <Link to="/dashboard/student"
        className={`flex items-center gap-3 p-2 rounded hover:bg-blue-600 
        ${location.pathname === '/dashboard/student' && "bg-blue-600"}`}>
        <Home size={20}/>
        {sidebarOpen && "Dashboard"}
      </Link>

      <Link to="/dashboard/student/attendance"
        className="flex items-center gap-3 p-2 rounded hover:bg-blue-600">
        <Calendar size={20}/>
        {sidebarOpen && "Attendance"}
      </Link>

      <Link to="/dashboard/student/profile"
        className="flex items-center gap-3 p-2 rounded hover:bg-blue-600">
        <User size={20}/>
        {sidebarOpen && "Profile"}
      </Link>

    </nav>

    <button
      onClick={handleLogout}
      className="p-3 m-2 bg-red-500 rounded hover:bg-red-600 flex items-center gap-2"
    >
      <LogOut size={18}/>
      {sidebarOpen && "Logout"}
    </button>
  </aside>

  {/* MAIN */}
  <main className="flex-1 flex flex-col">

    {/* HEADER */}
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Student Dashboard</h1>
      <div className="text-sm text-gray-600">
        {user?.email}
      </div>
    </header>

    {/* CONTENT */}
    <div className="p-6 overflow-y-auto">
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="attendance" element={<div>Attendance Page</div>} />
        <Route path="profile" element={<div>Profile Page</div>} />
      </Routes>
    </div>

  </main>
</div>
  )
}

export default StudentDashboard