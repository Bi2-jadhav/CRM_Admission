import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './Components/context/AuthContext'
import { Toaster } from "sonner";
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './Components/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage'
import HomePage from './pages/HomePage';
import './App.css'
import CounselorDashboard from './pages/counselor/CounselorDashboard';
import { DataProvider } from './Components/context/DataContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>   {/* ✅ ADD THIS */}
          <Toaster position="top-right" richColors />

          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route
                path="/dashboard/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/counselor/*"
                element={
                  <ProtectedRoute allowedRoles={['COUNSELOR']}>
                    <CounselorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

        </DataProvider>   {/* ✅ END */}
      </AuthProvider>
    </Router>
  )
}
export default App