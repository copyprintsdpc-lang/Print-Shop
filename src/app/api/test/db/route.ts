import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  try {
    // Test database connection
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://sdpcdb:Vamsi%4054312@cluster0.wjswahh.mongodb.net/'
    
    if (mongoose.connection.readyState === 1) {
      // Already connected
      return NextResponse.json({
        success: true,
        message: 'Database already connected',
        status: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      })
    }

    // Try to connect
    await mongoose.connect(mongoUri)
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      status: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: await mongoose.connection.db.listCollections().toArray()
    })
    
  } catch (error: any) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 })
  }
}
