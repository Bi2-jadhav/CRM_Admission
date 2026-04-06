import { useEffect } from 'react'
import { useData } from '../../Components/context/DataContext'
import { Users, List, FileText } from 'lucide-react'
import './AdminHome.css'

function AdminHome() {

  // ✅ SAFE DESTRUCTURING (IMPORTANT)
  const {
    users = [],
    getAllUsers,
    lists = [],
    enquiries = [],
    loading
  } = useData()

  // ✅ FETCH USERS
  useEffect(() => {
    getAllUsers()
  }, [])

  // ✅ LOADING UI
  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>
  }

  // ✅ SAFE CALCULATIONS
  const totalUsers = users.length

  const totalCounselors =
    users.filter(u => u.role === 'COUNSELOR').length

  const totalLists = lists.length
  const totalEnquiries = enquiries.length

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'blue' },
    { label: 'Counselors', value: totalCounselors, icon: Users, color: 'green' },
    { label: 'Lead Lists', value: totalLists, icon: List, color: 'orange' },
    { label: 'Total Enquiries', value: totalEnquiries, icon: FileText, color: 'purple' }
  ]

  const enquiriesByStage = {
    'New': enquiries.filter(e => e.stage === 'New').length,
    'Called': enquiries.filter(e => e.stage === 'Called').length,
    'Follow-up': enquiries.filter(e => e.stage === 'Follow-up').length,
    'Closed': enquiries.filter(e => e.stage === 'Closed').length,
    'Converted': enquiries.filter(e => e.stage === 'Converted').length
  }

  return (
    <div className="admin-home">
      <div className="page-header">
        <h2>Welcome to Admin Dashboard</h2>
        <p>System Overview and Key Metrics</p>
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

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3>Enquiry Stages Distribution</h3>
          <div className="stage-list">
            {Object.entries(enquiriesByStage).map(([stage, count]) => (
              <div key={stage} className="stage-item">
                <div className="stage-label">
                  <span className="stage-name">{stage}</span>
                  <span className="stage-count">{count}</span>
                </div>
                <div className="stage-bar">
                  <div
                    className="stage-fill"
                    style={{
                      width: `${(count / Math.max(...Object.values(enquiriesByStage), 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <div className="action-item">
              <div className="action-icon">👥</div>
              <div className="action-text">
                <h4>Manage Users</h4>
                <p>Add, edit, or delete users and counselors</p>
              </div>
            </div>

            <div className="action-item">
              <div className="action-icon">📋</div>
              <div className="action-text">
                <h4>Manage Lead Lists</h4>
                <p>Create and manage lead sources</p>
              </div>
            </div>

            <div className="action-item">
              <div className="action-icon">📞</div>
              <div className="action-text">
                <h4>Manage Leads</h4>
                <p>Add, import, and assign leads</p>
              </div>
            </div>

            <div className="action-item">
              <div className="action-icon">📊</div>
              <div className="action-text">
                <h4>View Reports</h4>
                <p>Generate and view system reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome