'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LogIn, Loader2 } from 'lucide-react'

/**
 * AppAuthGuard - Protects all app pages by default
 * 
 * Public exceptions (no login required):
 * - /order-track/* - Anyone with order number can track
 * - /order-success - Order confirmation (after payment redirect)
 * - /admin/login - Admin login page
 * - /quote - Quote request page (MVP - no auth required)
 * - /order - Order page (MVP - no auth required)
 * 
 * All other pages in (app) route group require authentication
 */
export default function AppAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // List of public pages that don't require authentication
  const publicPaths = [
    '/order-track',
    '/order-success',
    '/admin/login',
    '/quote',
    '/order'
  ]

  // Check if current path is public
  const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))

  useEffect(() => {
    // Skip auth check for public paths
    if (isPublicPath) {
      return
    }

    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`)
    }
  }, [loading, isAuthenticated, router, pathname, isPublicPath])

  // Show loading state
  if (loading && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Public paths - allow access
  if (isPublicPath) {
    return <>{children}</>
  }

  // Protected paths - require authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <LogIn className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the application.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - show content
  return <>{children}</>
}

