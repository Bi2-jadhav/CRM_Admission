import { useState, useEffect } from 'react'
import { useData } from '../../Components/context/DataContext'
import { useAuth } from '../../Components/context/AuthContext'
import { Plus, Upload } from 'lucide-react'
import './MyEnquiries.css'

function MyEnquiries() {

  const { enquiries = [], users = [], callRecords = [], followups = [], addEnquiry, updateEnquiry, getAllEnquiries, error } = useData()
  const { user } = useAuth()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
    courseInterested: 'MBA',
    source: 'Inbound',
    status: 'New',
    counselorId: ''
  })

  const counselors = users.filter(u => u.role === 'COUNSELOR')

  // ✅ Fetch fresh data on component mount
  useEffect(() => {
    if (user?.id) {
      getAllEnquiries()
    }
  }, [user?.id, getAllEnquiries])

  // ✅ FIXED (consistent ID comparison)
  const myEnquiries = enquiries.filter(
    (e) => String(e.assignedCounselorId) === String(user?.id)
  )

  const courses = ['MBA', 'MCA', 'BCA', 'B.Tech', 'M.Tech', 'Other']
  const statuses = ['New', 'Called', 'Follow-up', 'Closed', 'Converted']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("counselorId", user?.id)

    try {
      const res = await fetch("http://localhost:8080/api/admin/enquiries/upload", {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText)
      }

      alert(await res.text())

      // ✅ Polling will refresh data automatically

    } catch (err) {
      alert("Upload failed ❌: " + err.message)
    }

    e.target.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.counselorId) {
      alert("Please select counselor")
      return
    }

    const payload = {
      ...formData,
      assignedCounselorId: parseInt(formData.counselorId),
      createdDate: new Date().toISOString().split('T')[0]
    }

    if (editingId) {
      await updateEnquiry(editingId, payload)
      setEditingId(null)
    } else {
      await addEnquiry(payload)
    }

    // ✅ Polling will refresh data automatically

    setFormData({
      studentName: '',
      phone: '',
      email: '',
      courseInterested: 'MBA',
      source: 'Inbound',
      status: 'New',
      counselorId: ''
    })

    setShowForm(false)
  }

  const handleEdit = (enquiry) => {
    setFormData({
      ...enquiry,
      counselorId: enquiry.assignedCounselorId || ''
    })
    setEditingId(enquiry.id)
    setShowForm(true)
  }

  return (
    <div className="my-enquiries">

      <div className="page-header">
        <h2>My Leads</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          
          <label className="btn-secondary">
            <Upload size={16} />
            Import Excel
            <input
              type="file"
              accept=".xlsx, .csv"
              onChange={handleFileUpload}
              hidden
            />
          </label>

          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            {showForm ? 'Cancel' : 'Add Lead'}
          </button>

        </div>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc' }}>
          Error loading enquiries: {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="enquiry-form">

          <input name="studentName" placeholder="Student Name"
            value={formData.studentName} onChange={handleInputChange} required />

          <input name="phone" placeholder="Phone"
            value={formData.phone} onChange={handleInputChange} required />

          <input name="email" placeholder="Email"
            value={formData.email} onChange={handleInputChange} />

          <select name="courseInterested"
            value={formData.courseInterested}
            onChange={handleInputChange}>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>

          <select name="source"
            value={formData.source}
            onChange={handleInputChange}>
            <option>Inbound</option>
            <option>Walkin</option>
            <option>Website</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>

          <select
            name="counselorId"
            value={formData.counselorId}
            onChange={handleInputChange}
            required
          >
            <option value="">Assign Counselor</option>
            {counselors.map(c => (
              <option key={c.id} value={c.id}>
                {c.name || c.email}
              </option>
            ))}
          </select>

          <button type="submit">
            {editingId ? 'Update Lead' : 'Add Lead'}
          </button>

        </form>
      )}

      <div className="enquiries-grid">

        {myEnquiries.length === 0 ? (
          <div className="empty-state">No leads found</div>
        ) : (
          myEnquiries.map(enquiry => {

            const counselor = users.find(
              u => String(u.id) === String(enquiry.assignedCounselorId)
            )

            return (
              <div
                key={enquiry.id}
                className="enquiry-card"
                onClick={() =>
                  setExpandedId(expandedId === enquiry.id ? null : enquiry.id)
                }
              >

                <span className="lead-status">{enquiry.status}</span>

                <h4>{enquiry.studentName}</h4>
                <p>{enquiry.phone}</p>

                {expandedId === enquiry.id && (
                  <div className="enquiry-details">

                    <p><b>Email:</b> {enquiry.email || 'N/A'}</p>
                    <p><b>Course:</b> {enquiry.courseInterested}</p>
                    <p><b>Status:</b> {enquiry.status}</p>

                    <p>
                      <b>Counselor:</b> {counselor?.name || counselor?.email || 'N/A'}
                    </p>

                    {/* ✅ Enhanced: Activity Summary */}
                    <div className="activity-summary">
                      <p><b>Total Calls:</b> {callRecords.filter(c => c.enquiryId === enquiry.id).length}</p>
                      <p><b>Pending Follow-ups:</b> {followups.filter(f => f.enquiryId === enquiry.id && f.status === 'Pending').length}</p>
                    </div>

                    {/* ✅ Enhanced: Latest Notes */}
                    {(() => {
                      const enquiryCalls = callRecords.filter(c => c.enquiryId === enquiry.id)
                      const enquiryFollowups = followups.filter(f => f.enquiryId === enquiry.id)
                      const latestCall = enquiryCalls.sort((a, b) => new Date(b.callDate) - new Date(a.callDate))[0]
                      const latestFollowup = enquiryFollowups.sort((a, b) => new Date(b.followupDate) - new Date(a.followupDate))[0]

                      return (
                        <div className="latest-notes">
                          {latestCall && (
                            <p><b>Latest Call:</b> {latestCall.remarks || 'No remarks'}</p>
                          )}
                          {latestFollowup && (
                            <p><b>Latest Follow-up:</b> {latestFollowup.remarks || 'No remarks'}</p>
                          )}
                        </div>
                      )
                    })()}

                    <div className="enquiry-actions">
                      <button onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(enquiry)
                      }}>
                        Edit
                      </button>
                    </div>

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

export default MyEnquiries