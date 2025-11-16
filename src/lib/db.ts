import mongoose from 'mongoose'
import { config } from './config'

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined
}

const globalState = (global.__mongooseConn ||= { conn: null, promise: null })

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalState.conn) return globalState.conn
  
  if (!globalState.promise) {
    const uri = config.mongodb.uri
    
    if (!uri) {
      throw new Error('Database connection string is not configured')
    }

    globalState.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxConnecting: 10,
    }).then(() => {
      return mongoose
    }).catch((err) => {
      console.error('MongoDB Atlas connection failed:', err.message)
      throw err
    })
  }
  
  globalState.conn = await globalState.promise
  return globalState.conn
}


