# Cloudinary Setup Guide for Sri Datta Print Center

## 🚀 Quick Setup Instructions

### 1. Get Your Cloudinary Credentials

1. **Login to Cloudinary Console**: Go to [https://cloudinary.com/console](https://cloudinary.com/console)
2. **Copy Your Credentials**: From your dashboard, copy:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz1234567890`)

### 2. Create Upload Preset

1. **Go to Settings**: In your Cloudinary console, go to **Settings** → **Upload**
2. **Create Upload Preset**: Click **Add Upload Preset**
3. **Configure Preset**:
   - **Preset Name**: `sdpc_print_media`
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `sdpc-print-media`
   - **Resource Type**: `Auto`
   - **Access Mode**: `Public`
   - **Transformations**: 
     - Quality: `auto`
     - Format: `auto`
4. **Save Preset**: Click **Save**

### 3. Update Environment Variables

Create a `.env.local` file in your project root with:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Application
APP_URL=http://localhost:3000
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=sdpc_print_media

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Configuration (Brevo SMTP)
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-brevo-username
BREVO_SMTP_PASS=your-brevo-password
EMAIL_FROM=copyprintsdpc@gmail.com
```

### 4. Install Cloudinary Package

```bash
npm install cloudinary
```

### 5. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Go to Admin Panel**: `http://localhost:3000/admin`
3. **Create a Product**: Try uploading product images
4. **Test Checkout**: Go to checkout and upload artwork files

## 📁 File Organization

Your files will be organized in Cloudinary as:

```
sdpc-print-media/
├── products/
│   ├── product_12345_image1.jpg
│   ├── product_12345_image2.jpg
│   └── ...
├── artwork/
│   ├── artwork_1640995200000_abc123.pdf
│   ├── artwork_1640995200001_def456.jpg
│   └── ...
└── temp/
    └── (temporary uploads)
```

## 🔧 Features Included

### ✅ **Automatic Image Optimization**
- **Quality**: Auto-optimized for web
- **Format**: Auto-converted to best format (WebP, AVIF, etc.)
- **Responsive**: Multiple sizes generated automatically
- **CDN**: Global content delivery network

### ✅ **File Type Support**
- **Images**: JPEG, PNG, WebP, TIFF
- **Documents**: PDF, DOC, DOCX
- **Archives**: ZIP, RAR
- **Size Limit**: 50MB per file

### ✅ **Security Features**
- **Upload Presets**: Secure unsigned uploads
- **File Validation**: Server-side validation
- **Access Control**: Public access for delivery
- **Transformations**: Secure image processing

### ✅ **Performance Features**
- **Lazy Loading**: Images load as needed
- **Progressive JPEG**: Better user experience
- **Auto-format**: Best format for each browser
- **Compression**: Automatic file size optimization

## 🎯 Usage Examples

### Product Images
```typescript
// Automatic optimization for product display
const productImageUrl = getOptimizedImageUrl(publicId, {
  width: 800,
  height: 600,
  crop: 'fit',
  quality: 'auto'
})
```

### Artwork Files
```typescript
// Original quality for printing
const artworkUrl = getOptimizedImageUrl(publicId, {
  quality: 100,
  format: 'auto'
})
```

### Thumbnails
```typescript
// Small thumbnails for listings
const thumbnailUrl = getOptimizedImageUrl(publicId, {
  width: 200,
  height: 150,
  crop: 'fill',
  quality: 'auto'
})
```

## 🚨 Troubleshooting

### Common Issues:

1. **Upload Fails**
   - Check your API credentials
   - Verify upload preset is set to "Unsigned"
   - Ensure file size is under 50MB

2. **Images Not Displaying**
   - Check if the URL is accessible
   - Verify the public ID is correct
   - Ensure the file exists in Cloudinary

3. **Slow Uploads**
   - Check your internet connection
   - Try smaller file sizes
   - Use image compression before upload

### Debug Mode:
Enable debug logging by adding to your `.env.local`:
```env
DEBUG=cloudinary:*
```

## 📊 Monitoring

### Cloudinary Dashboard:
- **Usage Statistics**: Track bandwidth and storage
- **Transformations**: Monitor image processing
- **Security**: View access logs
- **Analytics**: Performance metrics

### Key Metrics to Monitor:
- **Storage Used**: Keep track of your plan limits
- **Bandwidth**: Monitor CDN usage
- **Transformations**: Track image processing usage
- **API Calls**: Monitor upload/download requests

## 💰 Cost Optimization

### Free Tier Includes:
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **API Calls**: 25,000/month

### Optimization Tips:
1. **Use Auto Quality**: Reduces file sizes automatically
2. **Lazy Loading**: Load images only when needed
3. **Responsive Images**: Serve appropriate sizes
4. **Format Optimization**: Use WebP/AVIF when possible

## 🔄 Migration from AWS S3

If you later want to switch back to AWS S3:

1. **Update Configuration**: Change `src/lib/config.ts`
2. **Update Upload APIs**: Modify upload endpoints
3. **Migrate Files**: Use Cloudinary's migration tools
4. **Update URLs**: Update database with new URLs

## 🎉 Ready to Use!

Your Cloudinary integration is now complete and ready for production use. The system includes:

- ✅ **Automatic image optimization**
- ✅ **Secure file uploads**
- ✅ **Global CDN delivery**
- ✅ **Responsive image generation**
- ✅ **File type validation**
- ✅ **Error handling**
- ✅ **Progress tracking**

Start uploading and enjoy the fast, reliable file management system!
