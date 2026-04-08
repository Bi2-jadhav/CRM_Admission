import { useEffect } from 'react'
import { useData } from '../../Components/context/DataContext'
import './Admissions.css'

function Admissions() {

  const { admissions = [], getAllAdmissions } = useData()

  useEffect(() => {
    getAllAdmissions()
  }, [])

  const getStatusClass = (status) => {
    if (!status) return 'pending'

    switch (status.toLowerCase()) {
      case 'paid': return 'paid'
      case 'partial': return 'partial'
      default: return 'pending'
    }
  }

  return (
    <div className="admissions-container">

      <div className="admissions-header">
        <h2>Admissions</h2>
      </div>

      {!Array.isArray(admissions) ? (
        <div className="empty-state">Loading...</div>
      ) : admissions.length === 0 ? (
        <div className="empty-state">No admissions yet</div>
      ) : (
        <div className="admissions-grid">
          {admissions.map(a => (
            <div key={a.id} className="admission-card">

              <span className={`badge ${getStatusClass(a.paymentStatus)}`}>
                {a.paymentStatus || 'Pending'}
              </span>

              <h4>{a.studentName}</h4>

              <p><b>Course:</b> {a.courseSelected}</p>
              <p><b>Fees:</b> ₹{a.fees}</p>
              <p><b>Paid:</b> ₹{a.feesPaid}</p>
              <p><b>Date:</b> {a.admissionDate}</p>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Admissions