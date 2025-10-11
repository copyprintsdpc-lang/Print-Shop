# Vercel Setup Guide for Sri Datta Print Centre

## 🚀 **Step-by-Step Vercel Deployment**

### **Phase 1: Main Website Setup**

#### **Step 1: Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" 
3. Use your GitHub account (recommended)
4. Verify your email

#### **Step 2: Prepare Your Code**
We'll create two separate deployments:
1. **Main Website** (`sridattaprintcentre.com`)
2. **Web App** (`app.sridattaprintcentre.com`)

#### **Step 3: Deploy Main Website First**
1. In Vercel dashboard, click "New Project"
2. Import your GitHub repository
3. Configure build settings:
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   ```

#### **Step 4: Environment Variables (Main Website)**
Add these environment variables in Vercel:
```env
NEXT_PUBLIC_APP_URL=https://app.sridattaprintcentre.com
NODE_ENV=production
```

#### **Step 5: Custom Domain Setup**
1. Go to Project Settings → Domains
2. Add `sridattaprintcentre.com`
3. Add `www.sridattaprintcentre.com`
4. Copy the DNS records Vercel provides

### **Phase 2: Web App Setup**

#### **Step 6: Create Second Project**
1. Create another Vercel project for the web app
2. Use the same repository but different configuration

#### **Step 7: Environment Variables (Web App)**
Add all your production environment variables:
```env
# Database
MONGODB_URI=your-mongodb-atlas-uri

# JWT Authentication
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_SECRET=your-production-nextauth-secret

# Application URLs
NEXT_PUBLIC_APP_URL=https://app.sridattaprintcentre.com
NEXT_PUBLIC_MAIN_URL=https://sridattaprintcentre.com
NODE_ENV=production

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=sdpcbucket
CLOUDFRONT_DOMAIN=your-cloudfront-domain

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=sdpc_print_media

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Configuration
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-brevo-username
BREVO_SMTP_PASS=your-brevo-password
EMAIL_FROM=copyprintsdpc@gmail.com
```

#### **Step 8: Custom Domain for App**
1. Add `app.sridattaprintcentre.com` domain
2. Configure DNS records

### **Phase 3: DNS Configuration (GoDaddy)**

#### **Step 9: Update DNS Records**
In your GoDaddy DNS management:

**For Main Website:**
```
Type: A
Name: @
Value: 76.76.19.61 (Vercel IP)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**For App Subdomain:**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### **Phase 4: Testing & Go Live**

#### **Step 10: Test Everything**
1. Test main website: `sridattaprintcentre.com`
2. Test web app: `app.sridattaprintcentre.com`
3. Test file uploads
4. Test payment integration
5. Test email notifications

## 📋 **Pre-Deployment Checklist**

### **Before Deploying:**
- [ ] Update logo references in static pages
- [ ] Test all API routes locally
- [ ] Verify environment variables
- [ ] Check MongoDB connection
- [ ] Test AWS S3 integration
- [ ] Test Cloudinary integration
- [ ] Test Razorpay integration

### **After Deploying:**
- [ ] Verify SSL certificates
- [ ] Test both domains
- [ ] Test file uploads
- [ ] Test user registration
- [ ] Test order flow
- [ ] Test admin panel

## 🎯 **Expected Timeline**

- **Vercel Account Setup**: 10 minutes
- **Main Website Deploy**: 15 minutes
- **Web App Deploy**: 20 minutes
- **DNS Configuration**: 10 minutes
- **Testing**: 30 minutes
- **Total**: ~1.5 hours

## 🚀 **Ready to Start?**

Let's begin with creating your Vercel account and deploying the main website!
