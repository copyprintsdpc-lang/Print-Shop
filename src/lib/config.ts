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
    url: process.env.APP_URL || 'http://localhost:3000',
  },
  // Cloudinary Configuration
  cloudinary: {
    url: process.env.CLOUDINARY_URL || '',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'sdpc_print_media',
    secure: true,
  },
  // Razorpay Configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  // Email Configuration
  email: {
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
    user: process.env.BREVO_SMTP_USER || '',
    pass: process.env.BREVO_SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'copyprintsdpc@gmail.com',
  },
}
