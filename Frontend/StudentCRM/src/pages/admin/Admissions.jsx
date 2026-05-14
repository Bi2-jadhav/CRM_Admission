import { useEffect, useState } from 'react'
import { useData } from '../../Components/context/DataContext'
import { Users, GraduationCap, Calendar, CreditCard, ChevronRight } from 'lucide-react'
import './Admissions.css'
import { toast } from 'sonner'

function Admissions() {
  const { 
    admissions = [], 
    trainers = [], 
    getAllAdmissions, 
    getAllTrainers,
    updateAdmission 
  } = useData()

  useEffect(() => {
    getAllAdmissions()
    getAllTrainers()
  }, [])

  const handleAssignTrainer = async (admissionId, trainerId) => {
    const admission = admissions.find(a => a.id === admissionId);
    if (!admission) return;

    const success = await updateAdmission(admissionId, {
      ...admission,
      trainerId: parseInt(trainerId)
    });

    if (success) {
      toast.success("Trainer assigned successfully!");
    } else {
      toast.error("Failed to assign trainer.");
    }
  }

  const getStatusClass = (status) => {
    if (!status) return 'status-pending'
    switch (status.toLowerCase()) {
      case 'paid': return 'status-paid'
      case 'partial': return 'status-partial'
      default: return 'status-pending'
    }
  }

  const [editPaymentId, setEditPaymentId] = useState(null)
  const [paymentData, setPaymentData] = useState({ fees: 0, feesPaid: 0 })

  const handleUpdatePayment = async (admission) => {
    const success = await updateAdmission(admission.id, {
      ...admission,
      fees: parseFloat(paymentData.fees),
      feesPaid: parseFloat(paymentData.feesPaid)
    });

    if (success) {
      toast.success("Payment updated!");
      setEditPaymentId(null);
      getAllAdmissions();
    } else {
      toast.error("Update failed.");
    }
  }

  const startEditPayment = (a) => {
    setEditPaymentId(a.id);
    setPaymentData({ fees: a.fees, feesPaid: a.feesPaid });
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Admissions</h1>
          <p className="text-gray-500">Manage enrollments, fees, and assign trainers.</p>
        </div>
      </div>

      {!Array.isArray(admissions) ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : admissions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <GraduationCap className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No admissions found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {admissions.map(a => (
            <div key={a.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{a.studentName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} /> Admitted on {a.admissionDate}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusClass(a.paymentStatus)}`}>
                  {a.paymentStatus || 'Pending'}
                </span>
              </div>

              {/* COURSE & FEES INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Course</p>
                  <p className="font-bold text-gray-800">{a.courseSelected}</p>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-indigo-600 uppercase font-bold">Fee Details</p>
                    {editPaymentId !== a.id && (
                      <button 
                        onClick={() => startEditPayment(a)}
                        className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded hover:bg-indigo-700 transition"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {editPaymentId === a.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                        <span>Total Fees:</span>
                        <span className="font-bold">₹{a.fees?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 w-12">Paid:</span>
                        <input 
                          type="number"
                          className="w-full text-xs p-1 border rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                          value={paymentData.feesPaid}
                          onChange={(e) => setPaymentData({...paymentData, feesPaid: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                        <span>Pending:</span>
                        <span className="font-bold text-red-600">₹{(a.fees || 0) - (paymentData.feesPaid || 0)}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleUpdatePayment(a)}
                          className="flex-1 text-[10px] bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700 transition"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditPaymentId(null)}
                          className="flex-1 text-[10px] bg-gray-400 text-white py-1 rounded hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-gray-500">Paid</p>
                        <p className="text-sm font-bold text-green-600">₹{a.feesPaid || 0}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Pending</p>
                        <p className="text-sm font-bold text-red-600">₹{(a.fees || 0) - (a.feesPaid || 0)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> 
                  {a.trainerId ? "Current Trainer" : "Assign Trainer"}
                </label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all cursor-pointer"
                    value={a.trainerId || ""}
                    onChange={(e) => handleAssignTrainer(a.id, e.target.value)}
                  >
                    <option value="">Select a Trainer</option>
                    {trainers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.speciality})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
}
    </div>
  )
}

export default Admissions