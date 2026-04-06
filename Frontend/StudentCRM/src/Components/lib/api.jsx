import axios from "axios"

const API_BASE_URL = "http://localhost:8080"

const api = axios.create({
  baseURL: API_BASE_URL
})

// Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token && !config.url?.includes("/api/auth")) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Handle 403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // ❌ REMOVE auto logout OR make it safe
    if (error.response?.status === 403) {
      console.warn("Forbidden request")

      // ✅ DO NOT logout for file upload
      if (!error.config.url.includes('/api/student/resume')) {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export const apiCall = async (endpoint, method = "GET", data = null) => {
  const response = await api({
    url: endpoint,
    method,
    data
  })

  return response.data
}

export const uploadFile = async (endpoint, file) => {

  const formData = new FormData()
  formData.append("file", file)

  const token = localStorage.getItem("token") // ✅ ADD

  const response = await api.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}` // ✅ IMPORTANT
    }
  })

  return response.data
}

export default api