import { useState } from 'react'
import { useData } from '../../Components/context/DataContext'
import { useAuth } from '../../Components/context/AuthContext'
import { Plus } from 'lucide-react'
import './MyEnquiries.css'

function MyEnquiries() {

  const { enquiries = [], users = [], addEnquiry, updateEnquiry } = useData()
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
    stage: 'New',
    status: 'New',
    counselorId: ''
  })

  const counselors = users.filter(u => u.role === 'COUNSELOR')

  const myEnquiries = enquiries.filter(
    (e) => String(e.assignedCounselorId) === String(user?.id)
  )

  const courses = ['MBA', 'MCA', 'BCA', 'B.Tech', 'M.Tech', 'Other']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
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
      updateEnquiry(editingId, payload)
      setEditingId(null)
    } else {
      addEnquiry(payload)
    }

    setFormData({
      studentName: '',
      phone: '',
      email: '',
      courseInterested: 'MBA',
      source: 'Inbound',
      stage: 'New',
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

      {/* HEADER */}
      <div className="page-header">
        <h2>My Leads</h2>

        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add Lead'}
        </button>
      </div>

      {/* FORM */}
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

      {/* LIST */}
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

                <span className="lead-status">{enquiry.stage}</span>

                <h4>{enquiry.studentName}</h4>
                <p>{enquiry.phone}</p>

                {expandedId === enquiry.id && (
                  <div className="enquiry-details">

                    <p><b>Email:</b> {enquiry.email || 'N/A'}</p>
                    <p><b>Course:</b> {enquiry.courseInterested}</p>

                    <p>
                      <b>Counselor:</b> {counselor?.name || counselor?.email || 'N/A'}
                    </p>

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