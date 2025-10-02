import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined
}

const globalState = (global.__mongooseConn ||= { conn: null, promise: null })

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalState.conn) return globalState.conn
  
  if (!globalState.promise) {
    const uri = process.env.MONGODB_URI
    
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    console.log('Connecting to MongoDB Atlas...')
    globalState.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxConnecting: 10,
    }).then(() => {
      console.log('✅ Connected to MongoDB Atlas successfully')
      return mongoose
    }).catch((err) => {
      console.error('❌ MongoDB Atlas connection failed:', err.message)
      console.error('Please check:')
      console.error('1. MongoDB Atlas cluster is running')
      console.error('2. Your IP address is whitelisted in MongoDB Atlas')
      console.error('3. Database credentials are correct')
      console.error('4. Network connectivity to MongoDB Atlas')
      throw err
    })
  }
  
  globalState.conn = await globalState.promise
  return globalState.conn
}


