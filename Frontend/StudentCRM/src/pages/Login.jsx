
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../Components/ui/Button'   // ✅ FIXED
import { Input } from '../Components/ui/Input'
import { Card } from '../Components/ui/Card'
import { useAuth } from '../Components/context/AuthContext'
import { toast } from 'sonner'
import { LogIn, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await login(email, password)

      console.log("✅ Logged user:", user)   // 🔥 DEBUG

      if (!user || !user.role) {
        toast.error('Invalid user data')
        return
      }

      toast.success('Login successful!')

      // ✅ ROLE BASED REDIRECT
      if (user.role === 'ADMIN') {
        navigate('/dashboard/admin')
      } 
      else if (user.role === 'COUNSELOR') {
        navigate('/dashboard/counselor')
      } 
      else {
        navigate('/unauthorized')
      }

    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <div className="p-8">

            {/* Header */}
            <div className="mb-8 text-center">
              <LogIn className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sign In
              </h1>
              <p className="text-gray-600">
                Welcome back to CRM System
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">

              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Signup */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Don’t have an account?
              </p>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => navigate('/signup')}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Button>
            </div>

          </div>
        </Card>
      </div>
    </div>
  )
}

