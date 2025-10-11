const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Sri Datta Print Centre for Vercel deployment...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'vercel.json'
];

console.log('📋 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check environment variables
console.log('\n🔧 Environment Variables Checklist:');
const envVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'RAZORPAY_KEY_ID'
];

envVars.forEach(envVar => {
  console.log(`📝 ${envVar} - Add to Vercel environment variables`);
});

console.log('\n📋 Pre-deployment Checklist:');
console.log('□ Create Vercel account at vercel.com');
console.log('□ Connect GitHub repository');
console.log('□ Add environment variables to Vercel');
console.log('□ Configure custom domains');
console.log('□ Update DNS records in GoDaddy');
console.log('□ Test deployment');

console.log('\n🎯 Next Steps:');
console.log('1. Go to vercel.com and sign up');
console.log('2. Import your GitHub repository');
console.log('3. Add environment variables from .env.production.example');
console.log('4. Deploy and test!');

console.log('\n✨ Your app is ready for Vercel deployment!');
