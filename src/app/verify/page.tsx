'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function VerifyPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState('Verifying...')

  useEffect(() => {
    const token = params.get('token')
    const email = params.get('email')
    if (!token || !email) { setMessage('Invalid link'); return }
    ;(async () => {
      const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
      if (res.redirected) { router.push(res.url); return }
      if (res.ok) { router.push('/dashboard'); return }
      setMessage('Verification failed. Please request a new link.')
    })()
  }, [params, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
        <div className="text-lg" style={{ color: '#e5e7eb' }}>{message}</div>
      </div>
    </div>
  )
}


