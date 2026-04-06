
import { useEffect } from 'react'
import { useData } from '../../Components/context/DataContext'
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react'
import './Reports.css'

function Reports() {

  const data = useData()

  // ✅ SAFE DATA (FIXED)
  const enquiries = Array.isArray(data.enquiries)
    ? data.enquiries
    : data.enquiries?.data || []

  const callRecords = Array.isArray(data.callRecords)
    ? data.callRecords
    : data.callRecords?.data || []

  const followups = Array.isArray(data.followups)
    ? data.followups
    : data.followups?.data || []

  const users = Array.isArray(data.users)
    ? data.users
    : data.users?.data || []

  const loading = data.loading

  // ⏳ Prevent crash
  if (loading) {
    return <div className="loading">Loading reports...</div>
  }

  // ✅ Counselors
  const counselors = users.filter(
    u => u.role?.toLowerCase() === 'counselor'
  )

  // ================= STATS =================

  const totalEnquiries = enquiries.length
  const totalCalls = callRecords.length
  const totalFollowups = followups.length

  const convertedEnquiries = enquiries.filter(
    e => e.stage === 'Converted'
  ).length

  const conversionRate =
    totalEnquiries > 0
      ? ((convertedEnquiries / totalEnquiries) * 100).toFixed(1)
      : 0

  // ================= COUNSELOR PERFORMANCE =================

  const counselorPerformance = counselors.map(counselor => {

    const assignedEnquiries = enquiries.filter(
      e => String(e.assignedCounselorId) === String(counselor.id)
    )

    const convertedByCounselor = assignedEnquiries.filter(
      e => e.stage === 'Converted'
    ).length

    // ✅ FIXED HERE (NO CRASH)
    const callsByCounselor = callRecords.filter(
      c => String(c.counselorId) === String(counselor.id)
    )

    return {
      name: counselor.name,
      assignedEnquiries: assignedEnquiries.length,
      converted: convertedByCounselor,
      calls: callsByCounselor.length,
      conversionRate:
        assignedEnquiries.length > 0
          ? ((convertedByCounselor / assignedEnquiries.length) * 100).toFixed(1)
          : 0
    }
  })

  // ================= DEBUG =================
  useEffect(() => {
    console.log("callRecords:", callRecords)
    console.log("users:", users)
  }, [callRecords, users])

  const stats = [
    { label: 'Total Enquiries', value: totalEnquiries, icon: Users, color: 'blue' },
    { label: 'Call Records', value: totalCalls, icon: Activity, color: 'orange' },
    { label: 'Follow-ups Scheduled', value: totalFollowups, icon: TrendingUp, color: 'green' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: BarChart3, color: 'purple' }
  ]

  return (
    <div className="reports">

      <div className="page-header">
        <h2>System Reports</h2>
        <p>Comprehensive analytics and performance metrics</p>
      </div>

      {/* ===== STATS ===== */}
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

      {/* ===== COUNSELOR PERFORMANCE ===== */}
      <div className="report-section full-width">
        <h3>Counselor Performance Report</h3>

        <div className="report-table">
          <table>
            <thead>
              <tr>
                <th>Counselor</th>
                <th>Assigned</th>
                <th>Converted</th>
                <th>Calls</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>

            <tbody>
              {counselorPerformance.length > 0 ? (
                counselorPerformance.map((perf, index) => (
                  <tr key={index}>
                    <td>{perf.name}</td>
                    <td>{perf.assignedEnquiries}</td>
                    <td className="success-text">{perf.converted}</td>
                    <td>{perf.calls}</td>
                    <td>
                      <span className={`badge ${perf.conversionRate > 30 ? 'success' : 'warning'}`}>
                        {perf.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No counselor data available
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}

export default Reports

