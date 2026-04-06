import { useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LogOut,
  Users,
  List,
  FileText,
  BarChart3,
  Menu,
  X,
  BookOpen
} from 'lucide-react'
import { useAuth } from '../../Components/context/AuthContext'

import AdminHome from './AdminHome'
import ManageUsers from './ManageUsers'
import ManageLists from './ManageLists'
import ManageLeads from './ManageLeads'
import ManageCourses from './ManageCourses'
import Reports from './Reports'

import './AdminDashboard.css'

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  // ✅ FIXED: use "user" instead of "currentUser"
  const { user, logout } = useAuth()

  // ✅ FIXED: prevent white screen
  if (!user) return <div className="p-6 text-center">Loading...</div>

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const isActive = (path) => location.pathname.includes(path)

  return (
    <div className="admin-container">
      
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>CRM Admin</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          
          {/* ✅ FIXED ROUTES */}
          <Link
            to="/dashboard/admin"
            className={`nav-link ${
              isActive('/dashboard/admin') &&
              !isActive('users') &&
              !isActive('lists') &&
              !isActive('leads') &&
              !isActive('courses') &&
              !isActive('reports')
                ? 'active'
                : ''
            }`}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/dashboard/admin/users"
            className={`nav-link ${isActive('users') ? 'active' : ''}`}
          >
            <Users size={20} />
            {sidebarOpen && <span>Manage Users</span>}
          </Link>

          <Link
            to="/dashboard/admin/lists"
            className={`nav-link ${isActive('lists') ? 'active' : ''}`}
          >
            <List size={20} />
            {sidebarOpen && <span>Manage Lists</span>}
          </Link>

          <Link
            to="/dashboard/admin/leads"
            className={`nav-link ${isActive('leads') ? 'active' : ''}`}
          >
            <FileText size={20} />
            {sidebarOpen && <span>Manage Leads</span>}
          </Link>

          <Link
            to="/dashboard/admin/courses"
            className={`nav-link ${isActive('courses') ? 'active' : ''}`}
          >
            <BookOpen size={20} />
            {sidebarOpen && <span>Manage Courses</span>}
          </Link>

          <Link
            to="/dashboard/admin/reports"
            className={`nav-link ${isActive('reports') ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span>Reports</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>

            {/* ✅ FIXED user display */}
            <div className="user-info">
              <span className="user-name">{user.email}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/users" element={<ManageUsers />} />
            <Route path="/lists" element={<ManageLists />} />
            <Route path="/leads" element={<ManageLeads />} />
            <Route path="/courses" element={<ManageCourses />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </main>

      {/* FLOATING BUTTON */}
      {!sidebarOpen && (
        <button
          className="floating-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>
      )}
    </div>
  )
}

export default AdminDashboard