import { cookies } from 'next/headers'

type JwtPayload = {
  sub: string
  email: string
  // Optional claims we include in some tokens
  phone?: string
  role?: string
  permissions?: string[]
  iat: number
  exp: number
}

function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64urlJson(obj: unknown): string {
  return base64url(Buffer.from(JSON.stringify(obj)))
}

function getSecret(): Buffer {
  const secret =
    process.env.JWT_SECRET ||
    process.env.SDPC_JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return Buffer.from(secret)
}

export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresInSeconds = 60 * 60 * 24 * 7): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + expiresInSeconds
  const full: JwtPayload = { ...payload, iat, exp }
  const headerPart = base64urlJson(header)
  const payloadPart = base64urlJson(full)
  const unsigned = `${headerPart}.${payloadPart}`
  const crypto = require('crypto') as typeof import('crypto')
  const sig = crypto.createHmac('sha256', getSecret()).update(unsigned).digest()
  const sigPart = base64url(sig)
  return `${unsigned}.${sigPart}`
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const crypto = require('crypto') as typeof import('crypto')
    const [headerB64, payloadB64, sigB64] = token.split('.')
    if (!headerB64 || !payloadB64 || !sigB64) return null
    const unsigned = `${headerB64}.${payloadB64}`
    const expected = base64url(crypto.createHmac('sha256', getSecret()).update(unsigned).digest())
    if (expected !== sigB64) return null
    const json = Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    const payload = JSON.parse(json) as JwtPayload
    if (payload.exp && Date.now() / 1000 > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const store = await cookies()
  const isProd = process.env.NODE_ENV === 'production'
  store.set('sdp_session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAuthCookie() {
  const store = await cookies()
  const isProd = process.env.NODE_ENV === 'production'
  store.set('sdp_session', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { config } from './config'

const JWT_SECRET = config.jwt.secret

export interface JWTPayload {
  userId: string
  mobile: string
  role: string
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Hash OTP for storage
export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

// Verify OTP
export function verifyOTP(otp: string, hashedOTP: string): boolean {
  return hashOTP(otp) === hashedOTP
}

// Rate limiting helper
export function isRateLimited(attempts: number, maxAttempts: number = 5): boolean {
  return attempts >= maxAttempts
}

// Check if OTP is expired
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}
