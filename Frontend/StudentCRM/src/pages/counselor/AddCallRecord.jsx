import { useState } from 'react'
import { useAuth } from '../../Components/context/AuthContext'
import { useData } from '../../Components/context/DataContext'
import { Plus, ChevronDown } from 'lucide-react'
import './AddCallRecord.css'

function AddCallRecord() {
  const { user } = useAuth()

  const {
    enquiries = [],
    callRecords = [],
    addCallRecord,
    loading
  } = useData()

  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  const [formData, setFormData] = useState({
    enquiryId: '',
    callDate: new Date().toISOString().split('T')[0],
    duration: '',
    callStatus: 'Completed',
    remarks: ''
  })

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Unauthorized</div>

  const myEnquiries = enquiries.filter(
    e => String(e.assignedCounselorId) === String(user.id)
  )

  const myCallRecords = callRecords
    .filter(c => String(c.counselorId) === String(user.id))
    .filter(c => {
      const enquiry = enquiries.find(e => e.id === c.enquiryId)
      return enquiry?.studentName?.toLowerCase().includes(search.toLowerCase())
    })

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'completed'
      case 'Busy': return 'busy'
      case 'Failed': return 'failed'
      case 'Not Answered': return 'not-answered'
      default: return 'scheduled'
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const success = await addCallRecord({
      enquiryId: parseInt(formData.enquiryId),
      counselorId: user.id,
      callDate: formData.callDate,
      duration: parseInt(formData.duration),
      callStatus: formData.callStatus,
      remarks: formData.remarks
    })

    if (success) {
      setFormData({
        enquiryId: '',
        callDate: new Date().toISOString().split('T')[0],
        duration: '',
        callStatus: 'Completed',
        remarks: ''
      })
      setShowForm(false)
    }
  }

  return (
    <div className="add-call-record">

      {/* HEADER */}
      <div className="page-header">
        <h2>📞 Call Records</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Call'}
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search by student name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="call-form">
          <h3>Add Call Record</h3>

          <select
            name="enquiryId"
            value={formData.enquiryId}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select enquiry --</option>
            {myEnquiries.map(e => (
              <option key={e.id} value={e.id}>
                {e.studentName}
              </option>
            ))}
          </select>

          <input type="date" name="callDate" value={formData.callDate} onChange={handleInputChange} />
          <input type="number" name="duration" placeholder="Duration" value={formData.duration} onChange={handleInputChange} />

          <select name="callStatus" value={formData.callStatus} onChange={handleInputChange}>
            <option>Completed</option>
            <option>Not Answered</option>
            <option>Busy</option>
            <option>Failed</option>
          </select>

          <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="Remarks" />

          <button className="btn btn-primary">Save</button>
        </form>
      )}

      {/* LIST */}
      <div className="call-records-list">

        {myCallRecords.length === 0 ? (
          <div className="empty-state">
            <p>📭 No call records yet</p>
          </div>
        ) : (

          myCallRecords.map((c, index) => {
            const enquiry = enquiries.find(e => e.id === c.enquiryId)

            return (
              <div key={index} className="call-card">

                {/* HEADER */}
                <div
                  className="call-header"
                  onClick={() =>
                    setExpandedId(expandedId === index ? null : index)
                  }
                >
                  <div>
                    <h4>{enquiry?.studentName || 'Unknown'}</h4>
                    <p>{c.callDate}</p>
                  </div>

                  <span className={`badge ${getStatusClass(c.callStatus)}`}>
                    {c.callStatus}
                  </span>

                  <ChevronDown size={20} />
                </div>

                {/* DETAILS */}
                {expandedId === index && (
                  <div className="call-details">
                    <p><strong>Phone:</strong> {enquiry?.phone}</p>
                    <p><strong>Duration:</strong> {c.duration} mins</p>
                    <p><strong>Remarks:</strong> {c.remarks || 'N/A'}</p>
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

export default AddCallRecord