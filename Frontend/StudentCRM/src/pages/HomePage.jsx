
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Components/context/AuthContext'
import { Card } from '../Components/ui/Card'
import { Users, PhoneCall, ClipboardList, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const { authReady } = useAuth()
  const navigate = useNavigate()

  if (!authReady) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center rounded-xl">
              CRM
            </div>
            <span className="font-semibold text-lg">
              Student Admission CRM
            </span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/login')}
              className="px-4 py-2 border rounded-lg">
              Sign In
            </button>
            <button onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-6">
          Manage Student Admissions Smarter 🎓
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Track enquiries, assign counselors, manage follow-ups,
          and convert leads into admissions — all in one CRM system.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
          >
            Start Now
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      {/* FEATURES */}
      <div className="grid md:grid-cols-4 gap-6 px-10 mb-20">

        <FeatureCard
          icon={<Users className="text-blue-600" />}
          title="Leads Management"
          points={[
            'Capture student enquiries',
            'Track lead status',
          ]}
        />

        <FeatureCard
          icon={<PhoneCall className="text-green-600" />}
          title="Call Records"
          points={[
            'Log calls',
            'Track communication',
          ]}
        />

        <FeatureCard
          icon={<ClipboardList className="text-purple-600" />}
          title="Follow-Ups"
          points={[
            'Schedule follow-ups',
            'Never miss leads',
          ]}
        />

        <FeatureCard
          icon={<TrendingUp className="text-orange-600" />}
          title="Analytics"
          points={[
            'Conversion rate',
            'Counselor performance',
          ]}
        />

      </div>

      {/* CTA */}
      <div className="px-6 pb-20">
        <Card className="p-10 text-center bg-indigo-600 text-black rounded-xl">
          <h2 className="text-2xl font-bold mb-4">
            Boost Your Admissions 
          </h2>
          <p className="mb-6">
            Increase conversions with smart CRM tools
          </p>

          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg"
          >
            Get Started
          </button>
        </Card>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, points }) {
  return (
    <Card className="p-6 hover:shadow-xl transition rounded-xl">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        {points.map(p => (
          <li key={p} className="flex gap-2">
            <CheckCircle size={14} />
            {p}
          </li>
        ))}
      </ul>
    </Card>
  )
}

