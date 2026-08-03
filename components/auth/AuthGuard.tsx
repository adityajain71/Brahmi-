'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import { migrateGuestProgressToSupabase } from '@/lib/progress'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const router = useRouter()
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuthAndMigrate() {
      try {
        const currentIdentity = await getCurrentIdentity()
        if (!isMounted) return

        setIdentity(currentIdentity)

        if (currentIdentity.type === 'user' && currentIdentity.id) {
          // Perform resilient guest progress migration after user enters application
          await migrateGuestProgressToSupabase(currentIdentity.id)
        } else if (requireAuth && currentIdentity.type !== 'user') {
          router.push('/login')
          return
        }
      } catch (err) {
        console.error('AuthGuard error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    checkAuthAndMigrate()

    return () => {
      isMounted = false
    }
  }, [requireAuth, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1C1C1C] text-[#D4AF37]">
        <div className="flex flex-col items-center gap-3">
          <div className="text-3xl animate-pulse">✦</div>
          <p className="text-sm font-medium text-[#E6D8B8]/70">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
