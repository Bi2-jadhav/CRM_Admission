import { useState } from 'react'
import { useData } from '../../Components/context/DataContext'
import { Plus } from 'lucide-react'
import './ManageLeads.css'

function ManageLeads() {

  const {
    enquiries = [],
    addEnquiry,
    updateEnquiry,
    deleteEnquiry,
    users = []
  } = useData()

  // ✅ FIXED: role check (case-insensitive)
  const counselors = users.filter(
    u => u.role?.toLowerCase() === 'counselor'
  )

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
    courseInterested: 'MBA',
    source: 'Meta',
    stage: 'New',
    assignedCounselorId: null,
    status: 'New'
  })

  const sources = ['Meta', 'Website', 'Google', 'Instagram', 'Walkin', 'Inbound']
  const stages = ['New', 'Called', 'Follow-up', 'Closed', 'Converted']
  const courses = ['MBA', 'MCA', 'BCA', 'B.Tech', 'M.Tech', 'Other']

  // ✅ FIXED: handle number conversion
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'assignedCounselorId'
          ? (value ? Number(value) : null)
          : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      updateEnquiry(editingId, formData)
      setEditingId(null)
    } else {
      addEnquiry({
        ...formData,
        createdDate: new Date().toISOString().split('T')[0]
      })
    }

    setFormData({
      studentName: '',
      phone: '',
      email: '',
      courseInterested: 'MBA',
      source: 'Meta',
      stage: 'New',
      assignedCounselorId: null,
      status: 'New'
    })

    setShowForm(false)
  }

  const handleEdit = (enquiry) => {
    setFormData({
      studentName: enquiry.studentName || '',
      phone: enquiry.phone || '',
      email: enquiry.email || '',
      courseInterested: enquiry.courseInterested || 'MBA',
      source: enquiry.source || 'Meta',
      stage: enquiry.stage || 'New',
      assignedCounselorId: enquiry.assignedCounselorId || null,
      status: enquiry.status || 'New'
    })
    setEditingId(enquiry.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteEnquiry(id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div className="manage-leads">

      <div className="page-header">
        <h2>Manage Leads</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Lead'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="lead-form">

          <input
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            placeholder="Student Name"
            required
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />

          {/* Course */}
          <select name="courseInterested" value={formData.courseInterested} onChange={handleInputChange}>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Source */}
          <select name="source" value={formData.source} onChange={handleInputChange}>
            {sources.map(s => <option key={s}>{s}</option>)}
          </select>

          {/* ✅ Stage (NEW FIX) */}
          <select name="stage" value={formData.stage} onChange={handleInputChange}>
            {stages.map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Counselor */}
          <select
            name="assignedCounselorId"
            value={formData.assignedCounselorId || ''}
            onChange={handleInputChange}
          >
            <option value="">Unassigned</option>
            {counselors.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button type="submit">
            {editingId ? 'Update' : 'Add'}
          </button>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>

        </form>
      )}

      {/* LIST */}
      <div className="leads-list">

        {enquiries.length === 0 ? (
          <p>No leads found</p>
        ) : (
          enquiries.map(enquiry => (
            <div key={enquiry.id} className="lead-card">

              <div
                onClick={() =>
                  setExpandedId(expandedId === enquiry.id ? null : enquiry.id)
                }
              >
                <h4>{enquiry.studentName}</h4>
                <p>{enquiry.phone}</p>
              </div>

              {expandedId === enquiry.id && (
                <div>
                  <p>{enquiry.email}</p>
                  <p>{enquiry.courseInterested}</p>

                  {/* ✅ Show Counselor */}
                  <p>
                    <b>Counselor:</b>{" "}
                    {counselors.find(c => c.id === enquiry.assignedCounselorId)?.name || "Unassigned"}
                  </p>

                  {/* ✅ Show Stage */}
                  <p><b>Status:</b> {enquiry.stage}</p>

                  <button onClick={() => handleEdit(enquiry)}>Edit</button>
                  <button onClick={() => handleDelete(enquiry.id)}>Delete</button>
                </div>
              )}

            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default ManageLeads