'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to quote page - order form is masked for now
    router.replace('/quote')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to quote page...</p>
      </div>
    </div>
  )
}
