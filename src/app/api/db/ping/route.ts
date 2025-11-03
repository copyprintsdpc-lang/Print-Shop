import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/db'

export async function GET() {
  try {
    await connectToDatabase()
    const state = mongoose.connection.readyState // 0=disconnected,1=connected,2=connecting,3=disconnecting
    return NextResponse.json({ ok: true, state, source: process.env.MONGODB_URI ? 'env' : 'memory' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unknown' }, { status: 500 })
  }
}


