import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/auth'

type User = any

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (creds: { email?: string; password: string; username?: string }) => Promise<any>
  logout: () => Promise<void>
  refreshFromStorage: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const token = authService.getToken()

  useEffect(() => {
    // on mount, try to load user if token exists
    let mounted = true
    async function init() {
      if (token) {
        try {
          const u = await authService.fetchUser()
          if (!mounted) return
          setUser(u)
        } catch (e) {
          // token might be invalid
          authService.setToken(null)
          setUser(null)
        }
      }
      if (mounted) setLoading(false)
    }
    init()
    return () => {
      mounted = false
    }
  }, [])

  const login = async (creds: { email?: string; password: string; username?: string }) => {
    setLoading(true)
    const res = await authService.login(creds)
    // after login, attempt to fetch user
    try {
      const u = await authService.fetchUser()
      setUser(u)
    } catch (e) {
      setUser(null)
    }
    setLoading(false)
    return res
  }

  const logout = async () => {
    setLoading(true)
    await authService.logout()
    setUser(null)
    setLoading(false)
  }

  const refreshFromStorage = async () => {
    setLoading(true)
    const t = authService.getToken()
    if (t) {
      try {
        const u = await authService.fetchUser()
        setUser(u)
      } catch (e) {
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  const value: AuthContextValue = {
    user,
    token: token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    refreshFromStorage,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

export default AuthContext
