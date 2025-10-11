#!/usr/bin/env node

const { execSync } = require('child_process')
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

function runCommand(command, description) {
  log(`\n🚀 ${description}...`, 'blue')
  log(`Command: ${command}`, 'cyan')
  
  try {
    execSync(command, { stdio: 'inherit' })
    log(`✅ ${description} completed successfully`, 'green')
    return true
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red')
    return false
  }
}

function createBucketPolicy(bucketName, accountId) {
  return {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "AllowPublicRead",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": `arn:aws:s3:::${bucketName}/*`
      },
      {
        "Sid": "AllowApplicationAccess",
        "Effect": "Allow",
        "Principal": {
          "AWS": `arn:aws:iam::${accountId}:user/sdpc-s3-user`
        },
        "Action": [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ],
        "Resource": `arn:aws:s3:::${bucketName}/*`
      }
    ]
  }
}

function createCorsPolicy() {
  return [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": [
        "http://localhost:3000",
        "https://yourdomain.com",
        "https://www.yourdomain.com"
      ],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}

function createIAMPolicy(bucketName) {
  return {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl",
          "s3:GetObjectAcl"
        ],
        "Resource": `arn:aws:s3:::${bucketName}/*`
      },
      {
        "Effect": "Allow",
        "Action": [
          "s3:ListBucket"
        ],
        "Resource": `arn:aws:s3:::${bucketName}`
      }
    ]
  }
}

function createEnvFile(bucketName, region, cloudfrontDomain, distributionId) {
  const envContent = `# AWS S3 Configuration
AWS_REGION=${region}
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
S3_BUCKET_NAME=${bucketName}
S3_BUCKET_REGION=${region}

# CloudFront Configuration
CLOUDFRONT_DOMAIN=${cloudfrontDomain}
CLOUDFRONT_DISTRIBUTION_ID=${distributionId}

# File Upload Configuration
MAX_FILE_SIZE=209715200
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,ai,psd,docx
UPLOAD_FOLDER=uploads
PUBLIC_FOLDER=public
`

  fs.writeFileSync('.env.s3', envContent)
  log('📝 Created .env.s3 file with S3 configuration', 'green')
}

async function main() {
  log('🚀 SDPC S3 Setup Script', 'bright')
  log('=' .repeat(50), 'cyan')

  // Get user input
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (query) => new Promise(resolve => rl.question(query, resolve))

  try {
    // Get configuration from user
    const bucketName = await question('Enter S3 bucket name (default: sdpcbucket): ') || 'sdpcbucket'
    const region = await question('Enter AWS region (e.g., us-east-1): ')
    const accountId = await question('Enter your AWS Account ID: ')
    const cloudfrontDomain = await question('Enter CloudFront domain (optional, press Enter to skip): ')
    const distributionId = await question('Enter CloudFront Distribution ID (optional, press Enter to skip): ')

    if (!bucketName || !region || !accountId) {
      log('❌ Bucket name, region, and account ID are required', 'red')
      process.exit(1)
    }

    log(`\n📋 Configuration:`, 'yellow')
    log(`   Bucket: ${bucketName}`, 'cyan')
    log(`   Region: ${region}`, 'cyan')
    log(`   Account ID: ${accountId}`, 'cyan')
    log(`   CloudFront: ${cloudfrontDomain || 'Not configured'}`, 'cyan')

    const confirm = await question('\nProceed with setup? (y/N): ')
    if (confirm.toLowerCase() !== 'y') {
      log('Setup cancelled', 'yellow')
      process.exit(0)
    }

    // Step 1: Create S3 bucket
    log('\n📦 Step 1: Creating S3 bucket...', 'blue')
    const bucketCreated = runCommand(
      `aws s3 mb s3://${bucketName} --region ${region}`,
      'Create S3 bucket'
    )

    if (!bucketCreated) {
      log('❌ Failed to create bucket. Please check your AWS credentials and permissions.', 'red')
      process.exit(1)
    }

    // Step 2: Enable versioning
    runCommand(
      `aws s3api put-bucket-versioning --bucket ${bucketName} --versioning-configuration Status=Enabled`,
      'Enable bucket versioning'
    )

    // Step 3: Enable encryption
    runCommand(
      `aws s3api put-bucket-encryption --bucket ${bucketName} --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'`,
      'Enable server-side encryption'
    )

    // Step 4: Create bucket policy
    log('\n🔐 Step 2: Setting up bucket policy...', 'blue')
    const bucketPolicy = createBucketPolicy(bucketName, accountId)
    fs.writeFileSync('bucket-policy.json', JSON.stringify(bucketPolicy, null, 2))
    
    runCommand(
      `aws s3api put-bucket-policy --bucket ${bucketName} --policy file://bucket-policy.json`,
      'Apply bucket policy'
    )

    // Step 5: Configure CORS
    log('\n🌐 Step 3: Configuring CORS...', 'blue')
    const corsPolicy = createCorsPolicy()
    fs.writeFileSync('cors-policy.json', JSON.stringify(corsPolicy, null, 2))
    
    runCommand(
      `aws s3api put-bucket-cors --bucket ${bucketName} --cors-configuration file://cors-policy.json`,
      'Configure CORS policy'
    )

    // Step 6: Create IAM user
    log('\n👤 Step 4: Creating IAM user...', 'blue')
    runCommand(
      'aws iam create-user --user-name sdpc-s3-user',
      'Create IAM user'
    )

    // Step 7: Create IAM policy
    const iamPolicy = createIAMPolicy(bucketName)
    fs.writeFileSync('s3-policy.json', JSON.stringify(iamPolicy, null, 2))
    
    runCommand(
      'aws iam create-policy --policy-name SDPCS3Policy --policy-document file://s3-policy.json',
      'Create IAM policy'
    )

    // Get policy ARN
    const policyArn = `arn:aws:iam::${accountId}:policy/SDPCS3Policy`
    
    runCommand(
      `aws iam attach-user-policy --user-name sdpc-s3-user --policy-arn ${policyArn}`,
      'Attach policy to user'
    )

    // Step 8: Create access key
    log('\n🔑 Step 5: Creating access key...', 'blue')
    runCommand(
      'aws iam create-access-key --user-name sdpc-s3-user --output json > access-key.json',
      'Create access key'
    )

    // Step 9: Create environment file
    log('\n📝 Step 6: Creating environment file...', 'blue')
    createEnvFile(bucketName, region, cloudfrontDomain, distributionId)

    // Step 10: Test bucket access
    log('\n🧪 Step 7: Testing bucket access...', 'blue')
    runCommand(
      `aws s3 ls s3://${bucketName}`,
      'Test bucket access'
    )

    // Cleanup temporary files
    log('\n🧹 Cleaning up temporary files...', 'blue')
    const tempFiles = ['bucket-policy.json', 'cors-policy.json', 's3-policy.json']
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
    })

    // Display results
    log('\n🎉 S3 Setup Complete!', 'green')
    log('=' .repeat(50), 'cyan')
    
    log('\n📋 Next Steps:', 'yellow')
    log('1. Copy the access key from access-key.json', 'cyan')
    log('2. Update your .env.local file with the S3 configuration', 'cyan')
    log('3. Test file uploads in your application', 'cyan')
    log('4. Set up CloudFront distribution (optional)', 'cyan')
    
    log('\n📁 Files created:', 'yellow')
    log('   - .env.s3 (S3 configuration template)', 'cyan')
    log('   - access-key.json (AWS access credentials)', 'cyan')
    
    log('\n⚠️  Important:', 'red')
    log('   - Keep access-key.json secure and never commit it to version control', 'yellow')
    log('   - Update your .env.local file with the actual credentials', 'yellow')
    log('   - Test the setup before deploying to production', 'yellow')

  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red')
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Check if AWS CLI is installed
try {
  execSync('aws --version', { stdio: 'ignore' })
} catch (error) {
  log('❌ AWS CLI is not installed. Please install it first:', 'red')
  log('   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html', 'cyan')
  process.exit(1)
}

main()
