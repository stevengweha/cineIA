'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/') {
      router.push('/')
    }
  }, [isAuthenticated, pathname, router])

  return <>{children}</>
}
