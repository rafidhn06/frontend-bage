"use client"

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAuth from '../hooks/useAuth'

// Client-side guard that redirects unauthenticated users to /auth/login
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // still deciding

    // public paths: /post, /place and auth pages
    const publicPrefixes = ['/post', '/place', '/auth']

    const isPublic = publicPrefixes.some((p) => pathname === p || pathname?.startsWith(p + '/'))

    if (!isPublic && !isAuthenticated) {
      // redirect to login
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, pathname, router])

  // while loading, avoid showing children flicker
  if (loading) return null

  return <>{children}</>
}
