'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function VerifyContent() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Colorful background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
      
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-8 shadow-2xl text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            🔐 Email Verification
          </div>
          <div className="text-2xl font-bold text-gray-800">{message}</div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Verifying...</div>}>
      <VerifyContent />
    </Suspense>
  )
}


