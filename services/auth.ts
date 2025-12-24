import apiClient from './apiClient'

type Credentials = { email?: string; password: string; username?: string }

const STORAGE_KEY = 'auth_token'

export function setToken(token: string | null) {
  try {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem(STORAGE_KEY, token)
      else localStorage.removeItem(STORAGE_KEY)
    }
  } catch (e) {
    // ignore storage errors
  }
}

export function getToken(): string | null {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY)
    }
  } catch (e) {
    // ignore
  }
  return null
}

export async function login(credentials: Credentials) {
  // POST /auth/login
  const res = await apiClient.post('/auth/login', credentials)
  // Try common locations for token
  const data = res.data || {}
  const token = data.token || data.access_token || data.data?.token || null
  if (token) setToken(token)
  return data
}

export async function logout() {
  // attempt server logout; ignore failures
  try {
    await apiClient.post('/auth/logout')
  } catch (e) {
    // ignore
  }
  setToken(null)
}

export async function fetchUser() {
  const res = await apiClient.get('/user')
  return res.data
}
