# 🔧 Upload Preset Setup Guide

## ❌ **Current Issue:**
Your test is failing because the upload preset `sdpc_print_media` doesn't exist in your Cloudinary dashboard.

## ✅ **Quick Fix Steps:**

### 1. **Go to Cloudinary Dashboard**
1. Open: [https://cloudinary.com/console](https://cloudinary.com/console)
2. Login with your account credentials

### 2. **Create Upload Preset**
1. **Navigate to**: Settings → Upload
2. **Click**: "Add Upload Preset"
3. **Configure the preset**:
   - **Preset name**: `sdpc_print_media`
   - **Signing Mode**: `Unsigned` ⚠️ (Very important!)
   - **Folder**: `test-uploads` (or leave empty)
   - **Resource Type**: `Auto`
   - **Access Mode**: `Public`
   - **Tags**: `test,cloudinary-test` (optional)

### 3. **Save the Preset**
1. Click **"Save"** button
2. The preset should now appear in your list

### 4. **Test Again**
1. Go back to: `http://localhost:3002`
2. Try uploading a file
3. It should work now!

## 🔄 **Alternative: Use a Different Preset Name**

If you want to use a different preset name, update the HTML file:

```javascript
// Change this line in index.html
const CLOUDINARY_UPLOAD_PRESET = 'your-new-preset-name';
```

## 🎯 **Expected Results After Setup:**

- ✅ Files upload successfully to Cloudinary
- ✅ You see success messages in the test app
- ✅ Files appear in your Cloudinary dashboard
- ✅ Upload URLs are generated correctly

## 🚨 **Common Issues:**

1. **"Upload preset not found"**: The preset doesn't exist or name is wrong
2. **"Invalid upload preset"**: Preset exists but is set to "Signed" instead of "Unsigned"
3. **"Access denied"**: Check your Cloudinary credentials

## 📋 **Quick Checklist:**

- [ ] Cloudinary dashboard is open
- [ ] Preset name is exactly: `sdpc_print_media`
- [ ] Signing Mode is set to: `Unsigned`
- [ ] Preset is saved and appears in the list
- [ ] Test app is running on port 3002

---

**Once you create the upload preset, your Cloudinary test will work perfectly! 🚀**
