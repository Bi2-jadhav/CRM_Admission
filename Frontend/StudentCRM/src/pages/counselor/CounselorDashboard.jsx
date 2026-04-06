import { useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { LogOut, Home, FileText, Phone, Calendar, TrendingUp, Menu, X } from 'lucide-react'
import { useAuth } from '../../Components/context/AuthContext'

import CounselorHome from './CounselorHome'
import MyEnquiries from './MyEnquiries'
import AddCallRecord from './AddCallRecord'
import ScheduleFollowup from './ScheduleFollowup'
import MyPerformance from './MyPerformance'

import './CounselorDashboard.css'

function CounselorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const { user, logout, authReady } = useAuth()

  // ✅ Wait for auth
  if (!authReady) {
    return <div style={{ padding: "20px" }}>Loading...</div>
  }

  // ✅ Proper redirect
  if (!user) {
    return <Navigate to="/login" />
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const isActive = (path) => location.pathname.includes(path)

  return (
    <div className="counselor-container">

      {/* SIDEBAR */}
      <aside className={`counselor-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Counselor</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="sidebar-nav">

          {/* ✅ ABSOLUTE PATHS (FIXED) */}
          <Link
            to="/dashboard/counselor"
            className={`nav-link ${
              location.pathname === '/dashboard/counselor' ? 'active' : ''
            }`}
          >
            <Home size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/dashboard/counselor/enquiries"
            className={`nav-link ${isActive('enquiries') ? 'active' : ''}`}
          >
            <FileText size={20} />
            {sidebarOpen && <span>My Enquiries</span>}
          </Link>

          <Link
            to="/dashboard/counselor/calls"
            className={`nav-link ${isActive('calls') ? 'active' : ''}`}
          >
            <Phone size={20} />
            {sidebarOpen && <span>Add Call Record</span>}
          </Link>

          <Link
            to="/dashboard/counselor/followups"
            className={`nav-link ${isActive('followups') ? 'active' : ''}`}
          >
            <Calendar size={20} />
            {sidebarOpen && <span>Schedule Follow-up</span>}
          </Link>

          <Link
            to="/dashboard/counselor/performance"
            className={`nav-link ${isActive('performance') ? 'active' : ''}`}
          >
            <TrendingUp size={20} />
            {sidebarOpen && <span>My Performance</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="counselor-main">
        <header className="counselor-header">
          <div className="header-content">
            <h1>Counselor Dashboard</h1>
            <div className="user-info">
              <span className="user-name">{user?.email}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
        </header>

        <div className="counselor-content">
          <Routes>
            {/* ✅ FIXED INDEX ROUTE */}
            <Route index element={<CounselorHome />} />
            <Route path="enquiries" element={<MyEnquiries />} />
            <Route path="calls" element={<AddCallRecord />} />
            <Route path="followups" element={<ScheduleFollowup />} />
            <Route path="performance" element={<MyPerformance />} />
          </Routes>
        </div>
      </main>

      {/* FLOAT BUTTON */}
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

export default CounselorDashboard