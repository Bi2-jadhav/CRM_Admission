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

  // ✅ FIXED
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
      return true   // ✅ IMPORTANT

    } catch (err) {
      console.error("Add call record error:", err)
      return false  // ✅ IMPORTANT
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

  // ✅ FIXED
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
      return true   // ✅ IMPORTANT

    } catch (err) {
      console.error("Add followup error:", err)
      return false  // ✅ IMPORTANT
    }
  }

  const updateFollowup = async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:8080/api/counselor/followups/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      })

      if (!res.ok) throw new Error("Failed to update followup")

      await getAllFollowups()

    } catch (err) {
      console.error("Update followup error:", err)
    }
  }

  // ================= INIT =================
  useEffect(() => {
    if (authReady && token) {
      getAllUsers()
      getAllEnquiries()
      getAllCallRecords()
      getAllFollowups()
    }
  }, [authReady, token])

  return (
    <DataContext.Provider
      value={{
        users,
        enquiries,
        callRecords,
        followups,
        loading,

        getAllUsers,
        getAllEnquiries,

        addEnquiry,
        updateEnquiry,

        getAllCallRecords,
        addCallRecord,

        getAllFollowups,
        addFollowup,
        updateFollowup
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