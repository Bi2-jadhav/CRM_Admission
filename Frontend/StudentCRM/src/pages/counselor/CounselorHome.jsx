import { useAuth } from '../../Components/context/AuthContext'
import { useData } from '../../Components/context/DataContext'
import { FileText, Phone, Calendar, TrendingUp } from 'lucide-react'
import './CounselorHome.css'

function CounselorHome() {
  const { user, authReady } = useAuth()
  const data = useData()

  // ✅ SAFE DATA
  const enquiries = Array.isArray(data.enquiries) ? data.enquiries : []
  const callRecords = Array.isArray(data.callRecords) ? data.callRecords : []
  const followups = Array.isArray(data.followups) ? data.followups : []

  const loading = data.loading

  if (!authReady) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  if (loading) return <div>Loading data...</div>

  // ✅ FILTERS
  const myEnquiries = enquiries.filter(
    (e) => String(e.assignedCounselorId) === String(user.id)
  )

  const myCalls = callRecords.filter(
    (c) => String(c.counselorId) === String(user.id)
  )

  const myFollowups = followups.filter(
    (f) => String(f.counselorId) === String(user.id)
  )

  // ✅ 🔥 FIXED HERE (status instead of stage)
  const convertedEnquiries = myEnquiries.filter(
    (e) => e.status === 'Converted'
  ).length

  const conversionRate =
    myEnquiries.length > 0
      ? ((convertedEnquiries / myEnquiries.length) * 100).toFixed(1)
      : 0

  const stats = [
    {
      label: 'Assigned Enquiries',
      value: myEnquiries.length,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Call Records',
      value: myCalls.length,
      icon: Phone,
      color: 'orange',
    },
    {
      label: 'Follow-ups',
      value: myFollowups.length,
      icon: Calendar,
      color: 'green',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'purple',
    },
  ]

  return (
    <div className="counselor-home">

      <div className="page-header">
        <h2>Welcome, {user.email}</h2>
        <p>Your daily dashboard and task summary</p>
      </div>

      {myEnquiries.length === 0 && (
        <div className="empty-state">
          <p>No enquiries assigned yet.</p>
        </div>
      )}

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">
                <Icon size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default CounselorHome