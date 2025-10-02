# 🚀 Setup Instructions for Testing Cloudinary

## 📋 **Step 1: Install Node.js**

1. **Download Node.js**: Go to [https://nodejs.org/](https://nodejs.org/)
2. **Choose**: Download the LTS version (recommended)
3. **Install**: Run the installer and follow the setup wizard
4. **Verify**: Open a new terminal and run:
   ```bash
   node --version
   npm --version
   ```

## 📦 **Step 2: Install Dependencies**

In your project directory, run:
```bash
npm install
npm install cloudinary dotenv
```

## 🧪 **Step 3: Test Cloudinary Configuration**

Run the test script:
```bash
node test-cloudinary.js
```

This will verify:
- ✅ Your Cloudinary credentials are working
- ✅ API connection is successful
- ✅ Configuration is correct

## ⚙️ **Step 4: Create Upload Preset**

1. **Go to**: [https://cloudinary.com/console](https://cloudinary.com/console)
2. **Navigate**: Settings → Upload
3. **Click**: "Add Upload Preset"
4. **Configure**:
   - **Preset name**: `sdpc_print_media`
   - **Signing Mode**: `Unsigned` ⚠️ (Very important!)
   - **Folder**: `sdpc-print-media`
   - **Resource Type**: `Auto`
   - **Access Mode**: `Public`
5. **Save**: Click "Save"

## 🚀 **Step 5: Start Development Server**

```bash
npm run dev
```

## 🧪 **Step 6: Test File Uploads**

### Test Admin Product Upload:
1. Go to: `http://localhost:3000/admin`
2. Navigate to: Products → Add New Product
3. Try uploading product images
4. Check your Cloudinary dashboard for uploaded files

### Test Customer Artwork Upload:
1. Go to: `http://localhost:3000/checkout`
2. Upload artwork files
3. Verify files appear in Cloudinary

## 🔍 **Troubleshooting**

### If you get "command not found" errors:
- Make sure Node.js is installed
- Restart your terminal after installing Node.js
- Check if Node.js is in your system PATH

### If Cloudinary test fails:
- Double-check your credentials in `.env.local`
- Ensure the upload preset is created and set to "Unsigned"
- Verify your Cloudinary account is active

### If uploads fail:
- Check browser console for errors
- Verify file size is under 50MB
- Ensure file type is supported

## ✅ **Success Indicators**

You'll know everything is working when:
- ✅ Test script runs without errors
- ✅ Files upload to Cloudinary dashboard
- ✅ Images display correctly in your app
- ✅ No console errors in browser

## 🎉 **Ready to Go!**

Once all tests pass, your file upload system is fully functional and ready for production use!
