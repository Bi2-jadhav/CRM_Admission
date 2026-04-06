
import { useState } from 'react'
import { useAuth } from '../../Components/context/AuthContext'
import { useData } from '../../Components/context/DataContext'
import { Plus, ChevronDown } from 'lucide-react'
import './ScheduleFollowup.css'

function ScheduleFollowup() {
  const { user, authReady } = useAuth()
  const data = useData()

  // ✅ SAFE DATA
  const enquiries = Array.isArray(data.enquiries) ? data.enquiries : []
  const followups = Array.isArray(data.followups) ? data.followups : []
  const users = Array.isArray(data.users) ? data.users : []

  const { addFollowup, updateFollowup, loading } = data

  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const [formData, setFormData] = useState({
    enquiryId: '',
    followupDate: '',
    status: 'Pending',
    remarks: ''
  })

  if (!authReady) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  if (loading) return <div>Loading...</div>

  // 🔥 SAFE FILTER (WITH FALLBACK)
  const myEnquiries = enquiries.filter(
    e => String(e.assignedCounselorId) === String(user.id)
  )

  const myFollowups = followups.filter(
    f => String(f.counselorId) === String(user.id)
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.enquiryId || !formData.followupDate) {
      alert("Please fill all required fields")
      return
    }

    addFollowup({
      enquiryId: parseInt(formData.enquiryId),
      counselorId: user.id,
      followupDate: formData.followupDate,
      status: formData.status,
      remarks: formData.remarks
    })

    setFormData({
      enquiryId: '',
      followupDate: '',
      status: 'Pending',
      remarks: ''
    })

    setShowForm(false)
  }

  const handleMarkComplete = (id) => {
    updateFollowup(id, { status: 'Completed' })
  }

  return (
    <div className="schedule-followup">

      {/* HEADER */}
      <div className="page-header">
        <h2>Schedule Follow-ups</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Schedule Follow-up'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="followup-form">

          {/* 🔥 SELECT ENQUIRY FIX */}
          <select
            name="enquiryId"
            value={formData.enquiryId}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select enquiry --</option>

            {myEnquiries.length > 0 ? (
              myEnquiries.map(e => (
                <option key={e.id} value={e.id}>
                  {e.studentName} ({e.phone})
                </option>
              ))
            ) : (
              <option disabled>No enquiries assigned</option>
            )}

          </select>

          <input
            type="date"
            name="followupDate"
            value={formData.followupDate}
            onChange={handleInputChange}
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Add notes"
          />

          <button type="submit" className="btn btn-primary">
            Add Follow-up
          </button>

        </form>
      )}

      {/* LIST */}
      <div className="followups-list">

        {myFollowups.length === 0 ? (
          <div className="empty-state">
            <p>No follow-ups yet</p>
          </div>
        ) : (

          myFollowups.map((f, index) => {

            const enquiry = enquiries.find(
              e => String(e.id) === String(f.enquiryId)
            )

            const counselor = users.find(
              u => String(u.id) === String(f.counselorId)
            )

            return (
              <div key={index} className="followup-card">

                <div
                  className="followup-header"
                  onClick={() =>
                    setExpandedId(expandedId === index ? null : index)
                  }
                >
                  <div>
                    <h4>{enquiry?.studentName || 'Unknown'}</h4>
                    <p>{f.followupDate}</p>
                  </div>

                  <span className={`badge ${f.status.toLowerCase()}`}>
                    {f.status}
                  </span>

                  <ChevronDown size={20} />
                </div>

                {expandedId === index && (
                  <div className="followup-details">

                    <p><strong>Phone:</strong> {enquiry?.phone}</p>
                    <p><strong>Course:</strong> {enquiry?.courseInterested}</p>
                    <p><strong>Remarks:</strong> {f.remarks || 'N/A'}</p>

                    <p>
                      <strong>Counselor:</strong>{' '}
                      {counselor?.name || counselor?.email || 'Unknown'}
                    </p>

                    {f.status === 'Pending' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleMarkComplete(f.id)}
                      >
                        Mark Completed
                      </button>
                    )}

                  </div>
                )}

              </div>
            )
          })

        )}

      </div>

    </div>
  )
}

export default ScheduleFollowup

