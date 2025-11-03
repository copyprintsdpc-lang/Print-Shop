import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

export async function GET() {
  try {
    await connectDB()
    return NextResponse.json({ 
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      status: 'ok'
    })
  } catch (error) {
    console.error('Database connection failed:', error)
    return NextResponse.json(
      { 
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
        status: 'error'
      },
      { status: 500 }
    )
  }
}
