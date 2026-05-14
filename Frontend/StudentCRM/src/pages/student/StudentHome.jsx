import { useEffect, useState } from "react";
import { useData } from "../../Components/context/DataContext";
import { useAuth } from "../../Components/context/AuthContext";
import { CreditCard, Calendar, AlertCircle, User, Mail, Phone, MapPin } from "lucide-react";

function StudentHome() {
  const { user, authReady } = useAuth();

  const {
    student,
    attendance,
    getStudentByUserId,
    getAttendanceByStudent
  } = useData();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (authReady && user?.id) {
        await getStudentByUserId(user.id);
        await getAttendanceByStudent(user.id);
        setLoading(false);
      }
    };
    fetchData();
  }, [authReady, user]);

  if (!authReady || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (student === null) {
     return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <AlertCircle size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">No Admission Found</h2>
        <p className="text-gray-500 text-center mt-2">
          It looks like you haven't been admitted to any course yet. 
          Please contact the administration for more details.
        </p>
      </div>
    );
  }

  const totalDays = attendance?.length || 0;
  const presentDays = attendance?.filter(a => a.status === "PRESENT").length || 0;

  const attendancePercent =
    totalDays === 0 ? 0 : ((presentDays / totalDays) * 100).toFixed(1);

  const totalFees = student?.fees || 0;
  const feesPaid = student?.feesPaid || 0;
  const pendingFees = totalFees - feesPaid;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Paid Fees Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CreditCard size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Paid</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Paid Fees</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">₹ {feesPaid.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">Total: ₹ {totalFees.toLocaleString()}</p>
        </div>

        {/* Attendance Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar size={24} />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Monthly</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Attendance</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{attendancePercent}%</p>
        </div>

        {/* Pending Fees Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Due</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pending Fees</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">₹ {pendingFees.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">Status: {student.paymentStatus}</p>
        </div>

      </div>

      {/* Course & Personal Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Info */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">My Enrolled Course</h2>
          <p className="text-blue-100 opacity-90 mb-6">Explore your current learning path and upcoming modules.</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 inline-block min-w-full md:min-w-[300px]">
            <h4 className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">Current Course</h4>
            <p className="text-2xl font-bold">{student.courseSelected || "No Course Enrolled"}</p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Email Address</p>
                <p className="text-sm font-medium text-gray-700">{student.email || "Not Provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Phone Number</p>
                <p className="text-sm font-medium text-gray-700">{student.phone || "Not Provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Current Address</p>
                <p className="text-sm font-medium text-gray-700">{student.address || "Not Provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;