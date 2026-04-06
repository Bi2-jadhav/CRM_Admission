
import { useState } from 'react'
import { useData } from '../../Components/context/DataContext'
import { useAuth } from '../../Components/context/AuthContext'
import { Plus, Edit2 } from 'lucide-react'
import './MyEnquiries.css'

function MyEnquiries() {
  const { enquiries = [], users = [], addEnquiry, updateEnquiry } = useData()
  const { user } = useAuth()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

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

  // ✅ Only counselors
  const counselors = users.filter(u => u.role === 'COUNSELOR')

  // ✅ FIXED FILTER (IMPORTANT)
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
      studentName: formData.studentName,
      phone: formData.phone,
      email: formData.email,
      courseInterested: formData.courseInterested,
      source: formData.source,
      stage: formData.stage,
      status: formData.status,

      // 🔥 FINAL FIX (CORRECT FIELD)
      assignedCounselorId: parseInt(formData.counselorId),

      createdDate: new Date().toISOString().split('T')[0]
    }

    if (editingId) {
      updateEnquiry(editingId, payload)
      setEditingId(null)
    } else {
      addEnquiry(payload)
    }

    // reset
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
      studentName: enquiry.studentName,
      phone: enquiry.phone,
      email: enquiry.email,
      courseInterested: enquiry.courseInterested,
      source: enquiry.source,
      stage: enquiry.stage,
      status: enquiry.status,
      counselorId: enquiry.assignedCounselorId || ''
    })

    setEditingId(enquiry.id)
    setShowForm(true)
  }

  return (
    <div className="my-enquiries">

      <div className="page-header">
        <h2>My Leads</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add New Lead'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="enquiry-form">

          <h3>{editingId ? 'Edit Lead' : 'Add New Lead'}</h3>

          <div className="form-grid">

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

            {/* ✅ ASSIGN COUNSELOR */}
            <select
              name="counselorId"
              value={formData.counselorId}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select Counselor --</option>
              {counselors.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name || c.email}
                </option>
              ))}
            </select>

          </div>

          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Lead' : 'Add Lead'}
          </button>

        </form>
      )}

      {/* LIST */}
      <div className="enquiries-list">
        {myEnquiries.map(enquiry => {

          // ✅ Map counselor name
          const counselor = users.find(
            u => String(u.id) === String(enquiry.assignedCounselorId)
          )

          return (
            <div key={enquiry.id} className="enquiry-card">
              <h4>{enquiry.studentName}</h4>
              <p>{enquiry.phone}</p>

              <p>
                Counselor: {counselor?.name || counselor?.email || 'N/A'}
              </p>

              <button onClick={() => handleEdit(enquiry)}>
                <Edit2 size={16}/> Edit
              </button>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default MyEnquiries

