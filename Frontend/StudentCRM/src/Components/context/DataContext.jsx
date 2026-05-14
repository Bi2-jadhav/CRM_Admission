import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export const DataProvider = ({ children }) => {

  const [users, setUsers] = useState([])
  const [lists, setLists] = useState([])   // ✅ SINGLE SOURCE
  const [courses, setCourses] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [callRecords, setCallRecords] = useState([])
  const [followups, setFollowups] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [student, setStudent] = useState(null)
  const [trainer, setTrainer] = useState(null)
  const [trainers, setTrainers] = useState([])
  const [trainerDashboard, setTrainerDashboard] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { token, authReady } = useAuth()



  // ================= USERS =================
  const getAllUsers = async () => {
    try {
      if (!token) return

      const res = await fetch('http://localhost:8080/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setUsers(data || [])

    } catch (err) {
      console.error("Users error:", err)
    }
  }

  // ================= ENQUIRIES =================
  const getAllEnquiries = async () => {
    try {
      if (!token) return

      const res = await fetch('http://localhost:8080/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error(`Failed to fetch enquiries: ${res.status}`)

      const data = await res.json()
      setEnquiries(data || [])
      setError(null)

    } catch (err) {
      console.error("Enquiry error:", err)
      setError(err.message)
    }
  }

  const addEnquiry = async (enquiry) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // 🔥 GET LOGGED USER

    const res = await fetch('http://localhost:8080/api/admin/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(enquiry)
    });

    if (!res.ok) throw new Error("Failed to add enquiry");

    const newData = await res.json();
    setEnquiries(prev => [...prev, newData]);

    return true;

  } catch (err) {
    console.error("Add enquiry error:", err);
    return false;
  }
};

  const updateEnquiry = async (id, enquiry) => {
    try {

      if (enquiry.stage === "Converted") {
        console.warn("❌ Cannot manually set Converted")
        return false
      }

      const res = await fetch(`http://localhost:8080/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(enquiry)
      })

      if (!res.ok) throw new Error("Failed to update enquiry")

      const updated = await res.json()

      setEnquiries(prev =>
        prev.map(e => (e.id === id ? updated : e))
      )

      return true

    } catch (err) {
      console.error("Update enquiry error:", err)
      return false
    }
  }

  const deleteEnquiry = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error("Failed to delete enquiry")

      setEnquiries(prev => prev.filter(e => e.id !== id))

    } catch (err) {
      console.error("Delete enquiry error:", err)
    }
  }

  // ================= CALL RECORDS =================
  const getAllCallRecords = async () => {
    try {
      if (!token) return

      const res = await fetch('http://localhost:8080/api/counselor/calls', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setCallRecords(data || [])

    } catch (err) {
      console.error("Call error:", err)
    }
  }

  const addCallRecord = async (call) => {
    try {
      const res = await fetch('http://localhost:8080/api/counselor/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(call)
      })

      if (!res.ok) throw new Error("Failed to save call")

      await getAllCallRecords()
      return true

    } catch (err) {
      console.error("Call error:", err)
      return false
    }
  }

  // ================= FOLLOWUPS =================
  const getAllFollowups = async () => {
    try {
      if (!token) return

      const res = await fetch('http://localhost:8080/api/counselor/followups', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setFollowups(data || [])

    } catch (err) {
      console.error("Followup error:", err)
    }
  }

  const addFollowup = async (followup) => {
    try {
      const res = await fetch('http://localhost:8080/api/counselor/followups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(followup)
      })

      if (!res.ok) throw new Error("Failed to save followup")

      await getAllFollowups()
      return true

    } catch (err) {
      console.error("Followup error:", err)
      return false
    }
  }

  const updateFollowup = async (id, followup) => {
    try {
      const res = await fetch(`http://localhost:8080/api/counselor/followups/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(followup)
      })

      if (!res.ok) throw new Error("Failed to update followup")

      await getAllFollowups()
      return true

    } catch (err) {
      console.error("Update followup error:", err)
      return false
    }
  }

  // ================= COURSES =================
  const getAllCourses = async () => {
    try {
      if (!token) return

      const res = await fetch('http://localhost:8080/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setCourses(data || [])

    } catch (err) {
      console.error("Courses error:", err)
    }
  }

  const addCourse = async (course) => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(course)
      })

      if (!res.ok) throw new Error("Failed")

      await getAllCourses()

    } catch (err) {
      console.error(err)
    }
  }

  const updateCourse = async (id, course) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(course)
      })

      if (!res.ok) throw new Error("Failed to update course")

      await getAllCourses()
      return true

    } catch (err) {
      console.error("Update course error:", err)
      return false
    }
  }

  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error("Failed to delete course")

      await getAllCourses()
      return true

    } catch (err) {
      console.error("Delete course error:", err)
      return false
    }
  }

  // ================= LISTS (LEAD SOURCE) =================
  const getAllLists = async () => {
    try {
      if (!token) return

      const res = await fetch('http://localhost:8080/api/admin/lists', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error("Failed to fetch lists")

      const data = await res.json()
      console.log("✅ Lead Sources:", data)

      setLists(data || [])

    } catch (err) {
      console.error("Lists error:", err)
    }
  }

  const addList = async (list) => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(list)
      })

      if (!res.ok) throw new Error("Failed")

      await getAllLists()

    } catch (err) {
      console.error(err)
    }
  }

  // ================= ADMISSIONS =================
  const getAllAdmissions = async () => {
    try {
      if (!token) return

      const res = await fetch('http://localhost:8080/api/admin/admissions', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setAdmissions(data || [])

    } catch (err) {
      console.error("Admissions error:", err)
    }
  }

  const addAdmission = async (admission) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // 🔥 GET USER

    const res = await fetch('http://localhost:8080/api/admin/admissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(admission)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const newData = await res.json();
    setAdmissions(prev => [...prev, newData]);

    await getAllEnquiries();

    return true;

  } catch (err) {
    console.error("Admission error:", err);
    return false;
  }
};

 // ================= student dashboard =================
const getAttendanceByStudent = async (userId) => {
  try {
    const res = await fetch(`http://localhost:8080/api/trainer/attendance/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) throw new Error("Failed to fetch attendance")

    const data = await res.json()
    setAttendance(data || [])

  } catch (err) {
    console.error("Attendance error:", err)
  }
}


const markAttendance = async (attendanceData) => {
  try {

    const user = JSON.parse(localStorage.getItem("user")); // 🔥 logged-in trainer

    const payload = {
      ...attendanceData
    };

    const res = await fetch(`http://localhost:8080/api/trainer/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Mark attendance failed with status ${res.status}: ${errText}`);
      throw new Error("Failed to mark attendance");
    }

    return true;

  } catch (err) {
    console.error("Mark attendance error:", err);
    return false;
  }
}

const getStudentByUserId = async (userId) => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/admin/admissions/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) throw new Error("Admission data not found");

    const data = await res.json().catch(() => null);
    if (data) {
      setStudent(data);
    } else {
      setStudent(null);
    }

  } catch (err) {
    console.error("Student error:", err);
  }
};

// ================= trainer dashboard =================
const getTrainerByUserId = async (userId) => {
  try {
    const res = await fetch(`http://localhost:8080/api/trainer/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 503) {
      console.error("Trainer Service is currently unavailable (503)");
      return;
    }
    
    if (!res.ok) throw new Error(`Failed to fetch trainer profile: ${res.status}`);
    
    const text = await res.text();
    if (!text) {
      console.warn("Trainer profile not found (empty response)");
      setTrainer(null);
      return;
    }

    const data = JSON.parse(text);
    setTrainer(data);
  } catch (err) {
    console.error("Trainer profile error:", err);
  }
};

const getTrainerDashboard = async (trainerId) => {
  try {
    const res = await fetch(`http://localhost:8080/api/trainer/dashboard/${trainerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.status === 503) {
      console.error("Trainer Service is currently unavailable (503)");
      return;
    }

    if (!res.ok) throw new Error(`Failed to fetch trainer dashboard: ${res.status}`);
    const data = await res.json();
    setTrainerDashboard(data || []);
  } catch (err) {
    console.error("Trainer dashboard error:", err);
  }
};

const createTrainerProfile = async (trainerData) => {
  try {
    const res = await fetch(`http://localhost:8080/api/trainer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(trainerData)
    });
    if (!res.ok) throw new Error("Failed to create trainer profile");
    const data = await res.json();
    setTrainer(data);
    return true;
  } catch (err) {
    console.error("Create trainer error:", err);
    return false;
  }
};

const updateTrainerProfile = async (id, trainerData) => {
  try {
    const res = await fetch(`http://localhost:8080/api/trainer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(trainerData)
    });
    if (!res.ok) throw new Error("Failed to update trainer profile");
    const data = await res.json();
    setTrainer(data);
    return true;
  } catch (err) {
    console.error("Update trainer error:", err);
    return false;
  }
};
const getAllTrainers = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/trainer', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch trainers");
    const data = await res.json();
    setTrainers(data || []);
  } catch (err) {
    console.error("Fetch trainers error:", err);
  }
};

const updateAdmission = async (id, updatedData) => {
  try {
    const res = await fetch(`http://localhost:8080/api/admin/admissions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) throw new Error("Failed to update admission");
    const data = await res.json();
    setAdmissions(prev => prev.map(a => a.id === id ? data : a));
    return true;
  } catch (err) {
    console.error("Update admission error:", err);
    return false;
  }
};

  // ================= INIT =================
  useEffect(() => {
    if (authReady && token) {
      getAllUsers()
      getAllEnquiries()
      getAllCallRecords()
      getAllFollowups()
      getAllCourses()
      getAllLists()       // ✅ IMPORTANT
      getAllAdmissions()
      getAllTrainers()
    }
  }, [authReady, token])

  return (
    <DataContext.Provider value={{
      users,
      enquiries,
      callRecords,
      followups,
      courses,
      lists,              // ✅ USE THIS
      admissions,
      student,
      trainer,
      trainers,
      trainerDashboard,
      attendance,
      loading,
      error,

      getAllUsers,
      getAllEnquiries,
      addEnquiry,
      updateEnquiry,
      deleteEnquiry,

      getAllCallRecords,
      addCallRecord,

      getAllFollowups,
      addFollowup,
      updateFollowup,

      getAllCourses,
      addCourse,
      updateCourse,
      deleteCourse,

      getAllLists,
      addList,

      getAllAdmissions,
      addAdmission,
      
      getAttendanceByStudent,
      markAttendance,
      getStudentByUserId,
      getTrainerByUserId,
      getTrainerDashboard,
      createTrainerProfile,
      updateTrainerProfile,
      getAllTrainers,
      updateAdmission
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}