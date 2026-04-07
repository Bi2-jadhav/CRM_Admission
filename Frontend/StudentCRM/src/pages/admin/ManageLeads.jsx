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

  const counselors = users.filter(
    u => u.role?.toLowerCase() === 'counselor'
  )

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const [search, setSearch] = useState("")
  const [filterStage, setFilterStage] = useState("All")

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await updateEnquiry(editingId, formData)
        setEditingId(null)
      } else {
        await addEnquiry({
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

    } catch (err) {
      console.error("Submit error:", err)
    }
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteEnquiry(id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
  }

  // ✅ FILTERED DATA
  const filteredEnquiries = enquiries.filter(e =>
    (e.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      e.phone?.includes(search)) &&
    (filterStage === "All" || e.stage === filterStage)
  )

  return (
    <div className="manage-leads">

      {/* HEADER */}
      <div className="page-header">
        <h2>Manage Leads</h2>

        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add Lead'}
        </button>
      </div>

      {/* 🔍 FILTERS */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)}>
          <option value="All">All</option>
          {stages.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="lead-form">
          <input name="studentName" value={formData.studentName} onChange={handleInputChange} placeholder="Student Name" required />
          <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" required />
          <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />

          <select name="courseInterested" value={formData.courseInterested} onChange={handleInputChange}>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>

          <select name="source" value={formData.source} onChange={handleInputChange}>
            {sources.map(s => <option key={s}>{s}</option>)}
          </select>

          <select name="stage" value={formData.stage} onChange={handleInputChange}>
            {stages.map(s => <option key={s}>{s}</option>)}
          </select>

          <select name="assignedCounselorId" value={formData.assignedCounselorId || ''} onChange={handleInputChange}>
            <option value="">Assign Counselor</option>
            {counselors.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button type="submit">
            {editingId ? 'Update Lead' : 'Add Lead'}
          </button>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}

      {/* LIST */}
      <div className="leads-list">

        {filteredEnquiries.length === 0 ? (
          <div className="empty-state">No leads found</div>
        ) : (
          filteredEnquiries.map(enquiry => (

            <div
              key={enquiry.id}
              className="lead-card"
              onClick={() =>
                setExpandedId(expandedId === enquiry.id ? null : enquiry.id)
              }
            >

              <span className="lead-status">{enquiry.stage}</span>

              <h4>{enquiry.studentName}</h4>
              <p>{enquiry.phone}</p>

              {expandedId === enquiry.id && (
                <div className="lead-details">

                  <p><b>Email:</b> {enquiry.email || 'N/A'}</p>
                  <p><b>Course:</b> {enquiry.courseInterested}</p>
                  <p><b>Source:</b> {enquiry.source}</p>

                  {/* 🔥 ASSIGN COUNSELOR */}
                  <div>
                    <b>Counselor:</b>{" "}
                    <select
                      value={enquiry.assignedCounselorId || ""}
                      onChange={async (e) => {
                        const newId = e.target.value ? Number(e.target.value) : null

                        await updateEnquiry(enquiry.id, {
                          ...enquiry,
                          assignedCounselorId: newId
                        })
                      }}
                    >
                      <option value="">Unassigned</option>
                      {counselors.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="lead-actions">
                    <button onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(enquiry)
                    }}>
                      Edit
                    </button>

                    <button onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(enquiry.id)
                    }}>
                      Delete
                    </button>
                  </div>

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