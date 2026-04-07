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
  const [loading, setLoading] = useState(false)

  const { token, authReady } = useAuth()

  // ================= USERS =================
  const getAllUsers = async () => {
    try {
      if (!token) return
      setLoading(true)

      const res = await fetch('http://localhost:8080/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setUsers(data || [])

    } catch (err) {
      console.error("Users error:", err)
    } finally {
      setLoading(false)
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

      if (!res.ok) throw new Error("Failed to add list")
      await getAllLists()

    } catch (err) {
      console.error("Add list error:", err)
    }
  }

  const updateList = async (id, list) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/lists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(list)
      })

      if (!res.ok) throw new Error("Failed to update list")
      await getAllLists()

    } catch (err) {
      console.error("Update list error:", err)
    }
  }

  const deleteList = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/lists/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error("Failed to delete list")
      await getAllLists()

    } catch (err) {
      console.error("Delete list error:", err)
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

      if (!res.ok) throw new Error("Failed to add course")
      await getAllCourses()

    } catch (err) {
      console.error("Add course error:", err)
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

    } catch (err) {
      console.error("Update course error:", err)
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

    } catch (err) {
      console.error("Delete course error:", err)
    }
  }

  // ================= ENQUIRIES =================
  const getAllEnquiries = async () => {
    try {
      if (!token) return

      const res = await fetch('http://localhost:8080/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setEnquiries(data || [])

    } catch (err) {
      console.error("Enquiry error:", err)
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
      await getAllEnquiries()

    } catch (err) {
      console.error("Add enquiry error:", err)
    }
  }

  const updateEnquiry = async (id, enquiry) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(enquiry)
      })

      if (!res.ok) throw new Error("Failed to update enquiry")
      await getAllEnquiries()

    } catch (err) {
      console.error(err)
    }
  }

  const deleteEnquiry = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error("Failed to delete enquiry")
      await getAllEnquiries()

    } catch (err) {
      console.error(err)
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
      console.error("Call records error:", err)
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

      if (!res.ok) throw new Error("Failed to save call record")

      await getAllCallRecords()

    } catch (err) {
      console.error("Add call record error:", err)
    }
  }

  // ================= FOLLOW-UPS =================
const getAllFollowups = async () => {
  try {
    if (!token) return

    const res = await fetch('http://localhost:8080/api/counselor/followups', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    setFollowups(data || [])

  } catch (err) {
    console.error("Followups error:", err)
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

  } catch (err) {
    console.error("Add followup error:", err)
  }
}

  // ================= INIT =================
  useEffect(() => {
    if (authReady && token) {
      getAllUsers()
      getAllLists()
      getAllCourses()
      getAllEnquiries()
      getAllCallRecords() // ✅ added
      getAllFollowups() // ✅ add this
    }
  }, [authReady, token])

  return (
    <DataContext.Provider
      value={{
        users,
        lists,
        courses,
        enquiries,
        callRecords,
        followups,
        loading,

        getAllUsers,
        getAllEnquiries,

        addList,
        updateList,
        deleteList,

        addCourse,
        updateCourse,
        deleteCourse,

        addEnquiry,
        updateEnquiry,
        deleteEnquiry,

        // ✅ NEW
        getAllCallRecords,
        addCallRecord,
        getAllFollowups,
        addFollowup
}}
    >
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