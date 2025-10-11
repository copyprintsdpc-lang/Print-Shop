import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'

export async function GET() {
  try {
    await dbConnect()
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
