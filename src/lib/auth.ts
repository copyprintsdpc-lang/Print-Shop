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
