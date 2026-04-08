import { useAuth } from '../../Components/context/AuthContext'
import { useData } from '../../Components/context/DataContext'
import { TrendingUp, Users, Phone, CheckCircle } from 'lucide-react'
import './MyPerformance.css'

function MyPerformance() {
  // ✅ FIXED ERROR
  const { user } = useAuth()
  const { enquiries = [], callRecords = [], followups = [], loading } = useData()

  // ✅ SAFETY
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Unauthorized</div>

  // ✅ FILTER DATA
  const myEnquiries = enquiries.filter(
  e => String(e.assignedCounselorId) === String(user.id)
)

  const myCalls = callRecords.filter(
    c => c.counselorId === user.id
  )

  const myFollowups = followups.filter(f => {
    const enquiry = enquiries.find(e => e.id === f.enquiryId)
    return enquiry && enquiry.assignedCounselorId === user.id
  })

  // ✅ FIXED: use status instead of stage
  const convertedEnquiries = myEnquiries.filter(
    e => e.status === 'Converted'
  ).length

  const conversionRate =
    myEnquiries.length > 0
      ? ((convertedEnquiries / myEnquiries.length) * 100).toFixed(1)
      : 0

  const totalCallDuration = myCalls.reduce(
    (sum, call) => sum + (call.duration || 0),
    0
  )

  const avgCallDuration =
    myCalls.length > 0
      ? (totalCallDuration / myCalls.length).toFixed(1)
      : 0

  const completedFollowups = myFollowups.filter(
    f => f.status === 'Completed'
  ).length

  // ✅ FIXED DISTRIBUTION (status-based)
  const enquiriesByStage = {
    New: myEnquiries.filter(e => e.status === 'New').length,
    Called: myEnquiries.filter(e => e.status === 'Called').length,
    'Follow-up': myEnquiries.filter(e => e.status === 'Follow-up').length,
    Closed: myEnquiries.filter(e => e.status === 'Closed').length,
    Converted: myEnquiries.filter(e => e.status === 'Converted').length
  }

  const callsByStatus = {}
  myCalls.forEach(call => {
    callsByStatus[call.callStatus] =
      (callsByStatus[call.callStatus] || 0) + 1
  })

  const stats = [
    { label: 'Total Enquiries', value: myEnquiries.length, icon: Users, color: 'blue' },
    { label: 'Converted', value: convertedEnquiries, icon: CheckCircle, color: 'green' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'orange' },
    { label: 'Total Calls', value: myCalls.length, icon: Phone, color: 'purple' }
  ]

  return (
    <div className="my-performance">
      <div className="page-header">
        <h2>My Performance Report</h2>
        <p>Your performance metrics and analytics</p>
      </div>

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

      <div className="performance-grid">
        <div className="performance-section">
          <h3>Enquiry Status Distribution</h3>

          <div className="distribution-table">
            {Object.entries(enquiriesByStage).map(([stage, count]) => (
              <div key={stage} className="distribution-row">
                <div className="distribution-label">
                  <span>{stage}</span>
                  <span>{count}</span>
                </div>

                <div className="distribution-bar">
                  <div
                    className="distribution-fill"
                    style={{
                      width: `${(count / Math.max(...Object.values(enquiriesByStage), 1)) * 100}%`
                    }}
                  />
                </div>

                <span>
                  {myEnquiries.length > 0
                    ? ((count / myEnquiries.length) * 100).toFixed(0)
                    : 0}
                  %
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="performance-section">
          <h3>Key Metrics</h3>

          <div className="metrics-list">
            <div className="metric-item">
              <span>Average Call Duration</span>
              <span>{avgCallDuration} min</span>
            </div>

            <div className="metric-item">
              <span>Total Call Duration</span>
              <span>{totalCallDuration} min</span>
            </div>

            <div className="metric-item">
              <span>Completed Follow-ups</span>
              <span>{completedFollowups}/{myFollowups.length}</span>
            </div>

            <div className="metric-item">
              <span>Follow-up Completion Rate</span>
              <span>
                {myFollowups.length > 0
                  ? ((completedFollowups / myFollowups.length) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {Object.keys(callsByStatus).length > 0 && (
        <div className="performance-section full-width">
          <h3>Call Status Summary</h3>

          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(callsByStatus).map(([status, count]) => (
                <tr key={status}>
                  <td>{status}</td>
                  <td>{count}</td>
                  <td>
                    {myCalls.length > 0
                      ? ((count / myCalls.length) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyPerformance