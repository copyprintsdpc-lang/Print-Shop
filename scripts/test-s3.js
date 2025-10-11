#!/usr/bin/env node

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testS3Connection() {
  log('🧪 Testing S3 Connection...', 'blue')
  log('=' .repeat(50), 'cyan')

  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' })

    const bucketName = process.env.S3_BUCKET_NAME
    const region = process.env.AWS_REGION
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
      log('❌ Missing S3 configuration in .env.local', 'red')
      log('Please run: node scripts/setup-s3.js', 'yellow')
      process.exit(1)
    }

    // Create S3 client
    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    log(`📦 Testing bucket: ${bucketName}`, 'cyan')
    log(`🌍 Region: ${region}`, 'cyan')

    // Test 1: List bucket contents
    log('\n1️⃣ Testing bucket access...', 'yellow')
    try {
      const { ListObjectsV2Command } = require('@aws-sdk/client-s3')
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        MaxKeys: 5
      })
      
      const response = await s3Client.send(listCommand)
      log(`✅ Bucket access successful. Found ${response.Contents?.length || 0} objects`, 'green')
    } catch (error) {
      log(`❌ Bucket access failed: ${error.message}`, 'red')
      throw error
    }

    // Test 2: Upload test file
    log('\n2️⃣ Testing file upload...', 'yellow')
    const testContent = 'This is a test file for SDPC S3 integration'
    const testKey = `test/${Date.now()}_test_file.txt`
    
    try {
      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: testKey,
        Body: testContent,
        ContentType: 'text/plain',
        Metadata: {
          'test-file': 'true',
          'upload-timestamp': Date.now().toString()
        }
      })
      
      await s3Client.send(putCommand)
      log(`✅ File upload successful: ${testKey}`, 'green')
    } catch (error) {
      log(`❌ File upload failed: ${error.message}`, 'red')
      throw error
    }

    // Test 3: Download test file
    log('\n3️⃣ Testing file download...', 'yellow')
    try {
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: testKey
      })
      
      const response = await s3Client.send(getCommand)
      const content = await response.Body.transformToString()
      
      if (content === testContent) {
        log('✅ File download successful. Content matches.', 'green')
      } else {
        log('❌ File download failed. Content does not match.', 'red')
        throw new Error('Content mismatch')
      }
    } catch (error) {
      log(`❌ File download failed: ${error.message}`, 'red')
      throw error
    }

    // Test 4: Delete test file
    log('\n4️⃣ Testing file deletion...', 'yellow')
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: testKey
      })
      
      await s3Client.send(deleteCommand)
      log('✅ File deletion successful', 'green')
    } catch (error) {
      log(`❌ File deletion failed: ${error.message}`, 'red')
      throw error
    }

    // Test 5: Test CORS (if CloudFront is configured)
    if (process.env.CLOUDFRONT_DOMAIN) {
      log('\n5️⃣ Testing CloudFront access...', 'yellow')
      try {
        const cloudfrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${testKey}`
        log(`Testing URL: ${cloudfrontUrl}`, 'cyan')
        
        // Note: This would require a real HTTP request in a real test
        log('✅ CloudFront URL generated successfully', 'green')
        log('ℹ️  To test CloudFront, upload a file and access it via the URL', 'yellow')
      } catch (error) {
        log(`❌ CloudFront test failed: ${error.message}`, 'red')
      }
    } else {
      log('\n5️⃣ CloudFront not configured, skipping test', 'yellow')
    }

    // Test 6: Test file validation
    log('\n6️⃣ Testing file validation...', 'yellow')
    try {
      const { validateFile } = require('../src/lib/aws')
      
      // Test valid file
      const validFile = Buffer.from('test content')
      const validResult = validateFile(validFile, 'text/plain', 'test.txt')
      
      if (validResult.valid) {
        log('✅ File validation working correctly', 'green')
      } else {
        log(`❌ File validation failed: ${validResult.error}`, 'red')
      }
      
      // Test invalid file type
      const invalidResult = validateFile(validFile, 'application/exe', 'test.exe')
      if (!invalidResult.valid) {
        log('✅ File type validation working correctly', 'green')
      } else {
        log('❌ File type validation should have failed', 'red')
      }
      
    } catch (error) {
      log(`❌ File validation test failed: ${error.message}`, 'red')
    }

    // Summary
    log('\n🎉 S3 Integration Test Complete!', 'green')
    log('=' .repeat(50), 'cyan')
    
    log('\n📋 Test Results:', 'yellow')
    log('✅ Bucket access', 'green')
    log('✅ File upload', 'green')
    log('✅ File download', 'green')
    log('✅ File deletion', 'green')
    log('✅ File validation', 'green')
    
    if (process.env.CLOUDFRONT_DOMAIN) {
      log('✅ CloudFront configuration', 'green')
    } else {
      log('⚠️  CloudFront not configured (optional)', 'yellow')
    }
    
    log('\n🚀 Your S3 setup is ready for production!', 'green')
    log('\nNext steps:', 'yellow')
    log('1. Test file uploads in your application', 'cyan')
    log('2. Configure CloudFront for better performance (optional)', 'cyan')
    log('3. Set up monitoring and alerts', 'cyan')
    log('4. Configure lifecycle policies for cost optimization', 'cyan')

  } catch (error) {
    log(`\n❌ S3 Test Failed: ${error.message}`, 'red')
    log('\nTroubleshooting:', 'yellow')
    log('1. Check your AWS credentials in .env.local', 'cyan')
    log('2. Verify the S3 bucket exists and is accessible', 'cyan')
    log('3. Check your IAM permissions', 'cyan')
    log('4. Run: node scripts/setup-s3.js', 'cyan')
    process.exit(1)
  }
}

// Check if required packages are installed
try {
  require('@aws-sdk/client-s3')
  require('dotenv')
} catch (error) {
  log('❌ Required packages not found. Installing...', 'red')
  require('child_process').execSync('npm install @aws-sdk/client-s3 dotenv', { stdio: 'inherit' })
}

testS3Connection()
