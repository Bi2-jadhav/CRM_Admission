import { useState, useEffect } from 'react'
import { useData } from '../../Components/context/DataContext'
import { useAuth } from '../../Components/context/AuthContext'
import { Plus, Upload } from 'lucide-react'
import './MyEnquiries.css'

function MyEnquiries() {

  const {
    enquiries = [],
    users = [],
    addEnquiry,
    updateEnquiry,
    getAllEnquiries,
    addAdmission,
    error
  } = useData()

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
    stage: 'New',              // ✅ FIXED
    counselorId: ''
  })

  const counselors = users.filter(u => u.role === 'COUNSELOR')

  // ✅ Fetch data
  useEffect(() => {
    if (user?.id) {
      getAllEnquiries()
    }
  }, [user?.id])

  // ✅ Only my enquiries
  const myEnquiries = enquiries.filter(
    (e) => String(e.assignedCounselorId) === String(user?.id)
  )

  const courses = ['MBA', 'MCA', 'BCA', 'B.Tech', 'M.Tech', 'Other']
  const statuses = ['New', 'Called', 'Follow-up', 'Closed', 'Converted']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 🔥 CONVERT FUNCTION (FIXED)
  const handleConvert = async (enquiry) => {

    const payload = {
      enquiryId: enquiry.id,
      studentName: enquiry.studentName,
      courseSelected: enquiry.courseInterested,
      fees: 0,
      feesPaid: 0,
      paymentStatus: 'Pending',
      admissionDate: new Date().toISOString().split('T')[0]
    }

    const success = await addAdmission(payload)

    if (success) {
      alert("✅ Converted to Admission")

      // 🔥 IMPORTANT FIX
      await getAllEnquiries()
    } else {
      alert("❌ Conversion failed")
    }
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

      // 🔥 Refresh after upload
      await getAllEnquiries()

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
      stage: formData.stage,   // ✅ FIXED
      assignedCounselorId: parseInt(formData.counselorId),
      createdDate: new Date().toISOString().split('T')[0]
    }

    if (editingId) {
      await updateEnquiry(editingId, payload)
      setEditingId(null)
    } else {
      await addEnquiry(payload)
    }

    // 🔥 Refresh after add/update
    await getAllEnquiries()

    setFormData({
      studentName: '',
      phone: '',
      email: '',
      courseInterested: 'MBA',
      source: 'Inbound',
      stage: 'New',
      counselorId: ''
    })

    setShowForm(false)
  }

  const handleEdit = (enquiry) => {
    setFormData({
      ...enquiry,
      stage: enquiry.stage || 'New',   // ✅ FIXED
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
        <div className="error-message">
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

          {/* ✅ FIXED */}
          <select
            name="stage"
            value={formData.stage}
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

            return (
              <div
                key={enquiry.id}
                className="enquiry-card"
                onClick={() =>
                  setExpandedId(expandedId === enquiry.id ? null : enquiry.id)
                }
              >

                {/* ✅ FIXED */}
                <span className="lead-status">{enquiry.stage}</span>

                <h4>{enquiry.studentName}</h4>
                <p>{enquiry.phone}</p>

                {expandedId === enquiry.id && (
                  <div className="enquiry-details">

                    <p><b>Email:</b> {enquiry.email || 'N/A'}</p>
                    <p><b>Course:</b> {enquiry.courseInterested}</p>

                    <div className="enquiry-actions">

                      <button onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(enquiry)
                      }}>
                        Edit
                      </button>

                      {/* ✅ FIXED */}
                      {enquiry.stage !== "Converted" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConvert(enquiry)
                          }}
                        >
                          Convert
                        </button>
                      )}

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