import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export const DataProvider = ({ children }) => {

  const [users, setUsers] = useState([])
  const [lists, setLists] = useState([])
  const [courses, setCourses] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [callRecords, setCallRecords] = useState([])
  const [followups, setFollowups] = useState([])
  const [admissions, setAdmissions] = useState([])
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
      const res = await fetch('http://localhost:8080/api/admin/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(enquiry)
      })

      if (!res.ok) throw new Error("Failed to add enquiry")

      const newData = await res.json()
      setEnquiries(prev => [...prev, newData])

      return true
    } catch (err) {
      console.error("Add enquiry error:", err)
      return false
    }
  }

  const updateEnquiry = async (id, enquiry) => {
    try {

      // ❌ BLOCK WRONG LOGIC
      if (enquiry.status === "Converted") {
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

      await getAllEnquiries()
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

  // ================= LISTS =================
  const getAllLists = async () => {
    try {
      if (!token) return
      const res = await fetch('http://localhost:8080/api/admin/lists', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
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
      const res = await fetch('http://localhost:8080/api/admin/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(admission)
      })

      if (!res.ok) {
  const errorText = await res.text()
  console.error("SERVER ERROR:", errorText)
  throw new Error(errorText)
}

      const newData = await res.json()
      setAdmissions(prev => [...prev, newData])

      // 🔥 IMPORTANT: sync enquiry status
      await getAllEnquiries()

      return true
    } catch (err) {
      console.error("Admission error:", err)
      return false
    }
  }

  // ================= INIT =================
  useEffect(() => {
    if (authReady && token) {
      getAllUsers()
      getAllEnquiries()
      getAllCallRecords()
      getAllFollowups()
      getAllCourses()
      getAllLists()
      getAllAdmissions()
    }
  }, [authReady, token])

  return (
    <DataContext.Provider value={{
      users,
      enquiries,
      callRecords,
      followups,
      courses,
      lists,
      admissions,
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

      getAllCourses,
      addCourse,

      getAllLists,
      addList,

      getAllAdmissions,
      addAdmission
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