import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    mobile: string
    role: string
  }
}

// Middleware to verify JWT token
export function verifyAuth(request: NextRequest): { user: any; error?: string } {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return { user: null, error: 'No token provided' }
    }

    const payload = verifyToken(token)
    if (!payload) {
      return { user: null, error: 'Invalid token' }
    }

    return { user: payload }
  } catch (error) {
    return { user: null, error: 'Token verification failed' }
  }
}

// Middleware wrapper for API routes
export function withAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const { user, error } = verifyAuth(request)

    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Authentication required' },
        { status: 401 }
      )
    }

    // Add user to request object
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = user

    return handler(authenticatedRequest)
  }
}

// Middleware for admin-only routes
export function withAdminAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const { user, error } = verifyAuth(request)

    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Authentication required' },
        { status: 401 }
      )
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Add user to request object
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = user

    return handler(authenticatedRequest)
  }
}
