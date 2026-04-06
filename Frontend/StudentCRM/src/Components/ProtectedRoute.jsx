import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, authReady } = useAuth()

  // ⏳ Wait until auth is ready
  if (!authReady) {
    return <div className="p-6 text-center">Loading...</div>
  }

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 🚫 Role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}