import { useEffect, useState } from "react";
import { useAuth } from "../../Components/context/AuthContext";
import { useData } from "../../Components/context/DataContext";
import { Users, BookOpen, Star, Save, X } from "lucide-react";
import { toast } from "sonner";

const TrainerDashboard = () => {
  const { user } = useAuth();
  const { 
    trainer, 
    trainerDashboard, 
    getTrainerByUserId, 
    getTrainerDashboard,
    createTrainerProfile,
    updateTrainerProfile,
    markAttendance
  } = useData();

  const [showSetup, setShowSetup] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    speciality: "",
    experience: 0,
    userId: user?.id
  });

  useEffect(() => {
    if (user?.id) {
      getTrainerByUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (trainer?.id) {
      getTrainerDashboard(trainer.id);
    }
  }, [trainer]);

  const handleMarkAttendance = async (studentUserId, status) => {
    const success = await markAttendance({
      userId: studentUserId,
      trainerId: trainer.id,
      status: status,
      date: new Date().toISOString().split('T')[0]
    });

    if (success) {
      toast.success(`Marked as ${status}`);
      getTrainerDashboard(trainer.id); // Refresh list
    } else {
      toast.error("Failed to mark attendance.");
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    let success = false;
    
    if (trainer?.id) {
      // Update existing
      success = await updateTrainerProfile(trainer.id, formData);
    } else {
      // Create new
      success = await createTrainerProfile(formData);
    }

    if (success) {
      toast.success(trainer?.id ? "Profile updated!" : "Profile created!");
      setShowSetup(false);
    } else {
      toast.error("Operation failed.");
    }
  };

  const startEditing = () => {
    setFormData({
      name: trainer.name,
      email: trainer.email,
      speciality: trainer.speciality,
      experience: trainer.experience,
      userId: user?.id
    });
    setShowSetup(true);
  };

  if (!trainer && !showSetup) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Welcome to the Trainer Portal! To get started and see your assigned students, please complete your professional profile.
          </p>
          <button 
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            onClick={() => setShowSetup(true)}
          >
            Setup Profile Now
          </button>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Setup Trainer Profile</h2>
            <button onClick={() => setShowSetup(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmitProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speciality (e.g. Java Full Stack, Python)</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.speciality}
                onChange={(e) => setFormData({...formData, speciality: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <input 
                type="number" 
                required
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {trainer.name}</h1>
          <p className="text-gray-500">Manage your students and track their progress.</p>
        </div>
        <button 
          onClick={startEditing}
          className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
        >
          Edit Profile
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-800">{trainerDashboard?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Speciality</p>
            <p className="text-xl font-bold text-gray-800">{trainer.speciality}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="text-2xl font-bold text-gray-800">{trainer.experience} Years</p>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Assigned Students</h2>
        </div>
        
        {!trainerDashboard || trainerDashboard.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No students assigned to you yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trainerDashboard.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="px-6 py-4 font-medium text-gray-800">{item.studentName}</td>
                    <td className="px-6 py-4 text-gray-600">{item.course}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                          <div 
                            className={`h-2 rounded-full ${item.attendancePercentage > 75 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${item.attendancePercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{item.attendancePercentage?.toFixed(0) || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {!item.userId ? (
                        <span className="text-[10px] text-red-500 font-medium bg-red-50 px-2 py-1 rounded">No User Linked</span>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleMarkAttendance(item.userId, 'PRESENT')}
                            className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-semibold transition-all"
                          >
                            Present
                          </button>
                          <button 
                            onClick={() => handleMarkAttendance(item.userId, 'ABSENT')}
                            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition-all"
                          >
                            Absent
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;