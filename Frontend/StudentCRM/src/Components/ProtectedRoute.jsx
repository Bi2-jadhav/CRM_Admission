
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, authReady } = useAuth()
  const location = useLocation()

  // ⏳ Wait until auth is ready
  if (!authReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    )
  }

  // 🔐 Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 🚫 Role not allowed → unauthorized page
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // ✅ Access granted
  return children
}