import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import VerificationToken from '@/models/VerificationToken'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return NextResponse.json({ ok: false, error: 'email and password required' }, { status: 400 })

    await connectToDatabase()
    await VerificationToken.deleteMany({})
    await User.deleteOne({ email: email.toLowerCase() })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email: email.toLowerCase(), passwordHash, verified: true, name })
    return NextResponse.json({ ok: true, user: { id: String(user._id), email: user.email } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'seed failed' }, { status: 500 })
  }
}


