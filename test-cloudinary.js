// Simple test script for Cloudinary integration
// Run this with: node test-cloudinary.js

require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

console.log('🧪 Testing Cloudinary Configuration...\n');

// Check if CLOUDINARY_URL is set
if (process.env.CLOUDINARY_URL) {
  console.log('✅ CLOUDINARY_URL found');
  console.log(`   Cloud Name: ${process.env.CLOUDINARY_URL.split('@')[1]}`);
} else {
  console.log('❌ CLOUDINARY_URL not found in environment variables');
  process.exit(1);
}

// Check if upload preset is set
if (process.env.CLOUDINARY_UPLOAD_PRESET) {
  console.log(`✅ Upload Preset: ${process.env.CLOUDINARY_UPLOAD_PRESET}`);
} else {
  console.log('❌ CLOUDINARY_UPLOAD_PRESET not found');
}

// Test Cloudinary configuration
try {
  cloudinary.config();
  console.log('✅ Cloudinary configured successfully');
  
  // Test API connection
  cloudinary.api.ping()
    .then(result => {
      console.log('✅ Cloudinary API connection successful');
      console.log(`   Status: ${result.status}`);
      console.log('\n🎉 Cloudinary is ready to use!');
      console.log('\nNext steps:');
      console.log('1. Create upload preset in Cloudinary dashboard');
      console.log('2. Start your Next.js app: npm run dev');
      console.log('3. Test file uploads in admin panel');
    })
    .catch(error => {
      console.log('❌ Cloudinary API connection failed');
      console.log('   Error:', error.message);
      console.log('\nPlease check your credentials and try again.');
    });
} catch (error) {
  console.log('❌ Cloudinary configuration failed');
  console.log('   Error:', error.message);
}
