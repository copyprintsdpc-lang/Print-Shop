// Configuration file for environment variables
export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://sdpcdb:Vamsi%4054312@cluster0.wjswahh.mongodb.net/',
  },
  jwt: {
    secret: process.env.SDPC_JWT_SECRET || process.env.JWT_SECRET || 'your-jwt-secret-here',
  },
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:3000',
  },
  // Razorpay Configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  // Email Configuration (Generic SMTP - supports any email provider)
  email: {
    host: process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    user: process.env.SMTP_USER || process.env.BREVO_SMTP_USER || '',
    pass: process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'copyprintsdpc@gmail.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Sri Datta Print Center',
  },
}
