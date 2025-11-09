import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function b64urlToUint8Array(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (b64url.length % 4)) % 4)
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function verifyJwtEdge(token: string): Promise<{ email: string; sub: string } | null> {
  try {
    const [headerB64, payloadB64, sigB64] = token.split('.')
    if (!headerB64 || !payloadB64 || !sigB64) return null
    const unsigned = `${headerB64}.${payloadB64}`
    const enc = new TextEncoder()
    const keyData = enc.encode(process.env.JWT_SECRET || '')
    if (!keyData.byteLength) return null
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    const signatureBytes = b64urlToUint8Array(sigB64)
    const signatureBuffer = signatureBytes.buffer.slice(signatureBytes.byteOffset, signatureBytes.byteOffset + signatureBytes.byteLength) as ArrayBuffer
    const dataBytes = enc.encode(unsigned)
    const dataBuffer = dataBytes.buffer.slice(dataBytes.byteOffset, dataBytes.byteOffset + dataBytes.byteLength) as ArrayBuffer
    const ok = await crypto.subtle.verify('HMAC', key, signatureBuffer, dataBuffer)
    if (!ok) return null
    const json = new TextDecoder().decode(b64urlToUint8Array(payloadB64))
    const payload = JSON.parse(json) as { sub: string; email: string; exp?: number }
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null
    return { email: payload.email, sub: payload.sub }
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('sdp_session')?.value
    const valid = token ? await verifyJwtEdge(token) : null
    if (!valid) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard'] }


