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
    if (uri) {
      globalState.promise = mongoose.connect(uri, {
        bufferCommands: false,
        maxConnecting: 10,
      }).catch(async (err: any) => {
        // Dev fallback: spin up an in-memory MongoDB when local/remote is unavailable
        if (process.env.NODE_ENV === 'production') throw err
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server')
          const mem = await MongoMemoryServer.create()
          const memUri = mem.getUri('copyprint-dev')
          return mongoose.connect(memUri, { bufferCommands: false })
        } catch (e) {
          console.error('In-memory MongoDB fallback failed:', e)
          throw err
        }
      })
    } else {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('MONGODB_URI is not set')
      }
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      const mem = await MongoMemoryServer.create()
      const memUri = mem.getUri('copyprint-dev')
      globalState.promise = mongoose.connect(memUri, { bufferCommands: false })
    }
  }
  globalState.conn = await globalState.promise
  return globalState.conn
}


