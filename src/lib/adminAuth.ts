import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from '@/lib/auth'

export interface AdminPayload {
  sub: string
  email: string
  role: string
  permissions: string[]
  iat: number
  exp: number
}

export function verifyAdminToken(token: string): AdminPayload | null {
  const payload = verifyJwt(token)
  if (!payload || !payload.role) return null
  return payload as AdminPayload
}

export function hasPermission(admin: AdminPayload, permission: string): boolean {
  return admin.permissions.includes(permission) || admin.role === 'super_admin'
}

export function hasRole(admin: AdminPayload, role: string): boolean {
  const roleHierarchy = {
    'super_admin': 3,
    'admin': 2,
    'staff': 1
  }
  
  const adminLevel = roleHierarchy[admin.role as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0
  
  return adminLevel >= requiredLevel
}

export async function authenticateAdmin(req: NextRequest): Promise<{
  admin: AdminPayload | null
  error: NextResponse | null
}> {
  const token = req.cookies.get('sdp_session')?.value
  
  if (!token) {
    return {
      admin: null,
      error: NextResponse.json(
        { ok: false, code: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  const admin = verifyAdminToken(token)
  if (!admin) {
    return {
      admin: null,
      error: NextResponse.json(
        { ok: false, code: 'invalid_token', message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
  }

  return { admin, error: null }
}

export async function requireAdminAuth(
  req: NextRequest,
  requiredPermission?: string,
  requiredRole?: string
): Promise<{
  admin: AdminPayload | null
  error: NextResponse | null
}> {
  const { admin, error } = await authenticateAdmin(req)
  
  if (error) {
    return { admin: null, error }
  }

  if (!admin) {
    return {
      admin: null,
      error: NextResponse.json(
        { ok: false, code: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(admin, requiredPermission)) {
    return {
      admin: null,
      error: NextResponse.json(
        { ok: false, code: 'forbidden', message: 'Insufficient permissions' },
        { status: 403 }
      )
    }
  }

  // Check role if required
  if (requiredRole && !hasRole(admin, requiredRole)) {
    return {
      admin: null,
      error: NextResponse.json(
        { ok: false, code: 'forbidden', message: 'Insufficient role level' },
        { status: 403 }
      )
    }
  }

  return { admin, error: null }
}

