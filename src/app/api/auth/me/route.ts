import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/auth'

export async function GET(_req: NextRequest) {
  try {
    const token = cookies().get('sdp_session')?.value
    if (!token) return NextResponse.json({ ok: false }, { status: 401 })
    
    const payload = verifyJwt(token)
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 })
    
    return NextResponse.json({ 
      ok: true, 
      user: { 
        id: payload.sub, 
        email: payload.email,
        name: payload.email.split('@')[0], // Fallback name
        role: 'customer'
      } 
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}
