import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST() {
  try {
    await clearAuthCookie()
    
    return NextResponse.json({
      ok: true,
      message: 'Logged out successfully'
    })
  } catch (err) {
    console.error('Admin logout error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

