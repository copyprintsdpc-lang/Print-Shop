// Simple test script to verify Cloudinary setup
// Run this with: node test-setup.js

console.log('🧪 Cloudinary Test Setup Verification\n');

// Check if we're in the right directory
const fs = require('fs');
const path = require('path');

console.log('📁 Checking project structure...');

const requiredFiles = [
  'package.json',
  '.env.local',
  'app/page.tsx',
  'components/FileUploadArea.tsx',
  'components/ImageGallery.tsx',
  'components/UploadStats.tsx',
  'app/api/upload/route.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    allFilesExist = false;
  }
});

console.log('\n🔧 Checking environment variables...');

try {
  require('dotenv').config({ path: '.env.local' });
  
  if (process.env.CLOUDINARY_URL) {
    console.log('✅ CLOUDINARY_URL found');
    const cloudName = process.env.CLOUDINARY_URL.split('@')[1];
    console.log(`   Cloud Name: ${cloudName}`);
  } else {
    console.log('❌ CLOUDINARY_URL not found');
  }
  
  if (process.env.CLOUDINARY_UPLOAD_PRESET) {
    console.log(`✅ Upload Preset: ${process.env.CLOUDINARY_UPLOAD_PRESET}`);
  } else {
    console.log('❌ CLOUDINARY_UPLOAD_PRESET not found');
  }
  
} catch (error) {
  console.log('❌ Error reading environment variables:', error.message);
}

console.log('\n📦 Checking dependencies...');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['cloudinary', 'next', 'react', 'react-dom', 'lucide-react'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - Missing from package.json`);
    }
  });
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

console.log('\n🎯 Next Steps:');
console.log('1. Install Node.js from https://nodejs.org/');
console.log('2. Run: npm install');
console.log('3. Run: npm run dev');
console.log('4. Open: http://localhost:3000');
console.log('5. Test file uploads!');

console.log('\n🚀 Ready to test your beautiful Cloudinary integration!');
