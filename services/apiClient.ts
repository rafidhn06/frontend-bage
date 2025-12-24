import axios from 'axios'
import * as authService from './auth'

const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''

const apiClient = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add Authorization header from localStorage if available (browser-only)
apiClient.interceptors.request.use((config: any) => {
  try {
    if (typeof window !== 'undefined') {
      const token = authService.getToken()
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch (e) {
    // ignore
  }
  return config
})

// Global response handler: on 401, clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    try {
      const status = error?.response?.status
      if (status === 401) {
        authService.setToken(null)
        if (typeof window !== 'undefined') {
          // force navigation to login
          window.location.href = '/auth/login'
        }
      }
    } catch (e) {
      // ignore
    }
    return Promise.reject(error)
  }
)

export default apiClient
