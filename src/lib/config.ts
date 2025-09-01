// Configuration file for environment variables
export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://sdpcdb:Vamsi%4054312@cluster0.wjswahh.mongodb.net/',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-here',
  },
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
  },
}
