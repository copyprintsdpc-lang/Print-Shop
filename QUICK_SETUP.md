# 🚀 Quick Setup Guide - Cloudinary Integration

## ✅ **What You Need to Do:**

### 1. **Replace Your Cloudinary URL**

In your `.env.local` file, replace this line:

```env
CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dyz54xx10
```

With your actual values from Cloudinary dashboard:

```env
CLOUDINARY_URL=cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz1234567890@dyz54xx10
```

### 2. **Create Upload Preset**

1. Go to [cloudinary.com/console](https://cloudinary.com/console)
2. Click **Settings** → **Upload**
3. Click **"Add Upload Preset"**
4. Configure:
   - **Preset name**: `sdpc_print_media`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `sdpc-print-media`
   - **Resource Type**: `Auto`
   - **Access Mode**: `Public`
5. Click **"Save"**

### 3. **Install Dependencies**

```bash
npm install
```

### 4. **Start Development Server**

```bash
npm run dev
```

## 🎯 **Test the Integration:**

1. **Admin Panel**: Go to `http://localhost:3000/admin`
2. **Create Product**: Try uploading product images
3. **Checkout**: Go to checkout and upload artwork files
4. **Cloudinary Dashboard**: Check your files are uploaded

## 🔍 **Where to Find Your Credentials:**

In your Cloudinary dashboard:
- **API Key**: Settings → API Keys (e.g., "123456789012345")
- **API Secret**: Settings → API Keys (e.g., "abcdefghijklmnopqrstuvwxyz1234567890")
- **Cloud Name**: Top of dashboard (e.g., "dyz54xx10")

## 📝 **Example CLOUDINARY_URL Format:**

```env
CLOUDINARY_URL=cloudinary://[API_KEY]:[API_SECRET]@[CLOUD_NAME]
```

Replace:
- `[API_KEY]` with your actual API Key
- `[API_SECRET]` with your actual API Secret  
- `[CLOUD_NAME]` with your actual Cloud Name (dyz54xx10)

## ✅ **That's It!**

Once you've updated the `.env.local` file with your actual credentials and created the upload preset, your file upload system will be fully functional!
