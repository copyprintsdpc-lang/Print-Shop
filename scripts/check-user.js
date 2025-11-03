#!/usr/bin/env node

/**
 * Check User Status Script
 * 
 * Checks if a user exists and their verification status
 * 
 * Usage:
 *   node scripts/check-user.js email@example.com
 */

require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

async function checkUser() {
  try {
    const email = process.argv[2]
    
    if (!email) {
      console.log(`\n${colors.yellow}Usage:${colors.reset}`)
      console.log(`   node scripts/check-user.js email@example.com\n`)
      process.exit(1)
    }

    console.log(`\n${colors.cyan}👤 Checking User Status${colors.reset}\n`)
    console.log('=' .repeat(60))
    
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      console.error(`${colors.red}❌ Error: MONGODB_URI not found${colors.reset}`)
      process.exit(1)
    }

    console.log(`\n${colors.blue}📡 Connecting to MongoDB...${colors.reset}`)
    await mongoose.connect(MONGODB_URI)
    console.log(`${colors.green}✅ Connected${colors.reset}`)

    // Get User model
    const UserSchema = new mongoose.Schema({
      email: String,
      name: String,
      mobile: String,
      role: String,
      verified: Boolean,
      createdAt: Date,
      updatedAt: Date,
    }, { timestamps: true })
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema)

    // Find user
    console.log(`\n${colors.blue}🔍 Searching for: ${email}${colors.reset}`)
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      console.log(`\n${colors.red}❌ User not found${colors.reset}`)
      console.log(`   Email: ${email}`)
      console.log(`\n${colors.yellow}💡 This email is not registered${colors.reset}\n`)
      await mongoose.connection.close()
      process.exit(0)
    }

    // Display user info
    console.log(`\n${colors.green}✅ User found!${colors.reset}\n`)
    console.log('─'.repeat(60))
    console.log(`   ${colors.yellow}ID:${colors.reset}       ${user._id}`)
    console.log(`   ${colors.yellow}Email:${colors.reset}    ${user.email}`)
    console.log(`   ${colors.yellow}Name:${colors.reset}     ${user.name || 'not set'}`)
    console.log(`   ${colors.yellow}Mobile:${colors.reset}   ${user.mobile || 'not set'}`)
    console.log(`   ${colors.yellow}Role:${colors.reset}     ${user.role || 'customer'}`)
    
    const verifiedIcon = user.verified ? '✅' : '❌'
    const verifiedColor = user.verified ? colors.green : colors.red
    console.log(`   ${colors.yellow}Verified:${colors.reset} ${verifiedColor}${verifiedIcon} ${user.verified ? 'YES' : 'NO'}${colors.reset}`)
    
    console.log(`   ${colors.yellow}Created:${colors.reset}  ${user.createdAt ? user.createdAt.toLocaleString() : 'unknown'}`)
    console.log(`   ${colors.yellow}Updated:${colors.reset}  ${user.updatedAt ? user.updatedAt.toLocaleString() : 'unknown'}`)
    console.log('─'.repeat(60))

    if (user.verified) {
      console.log(`\n${colors.green}🎉 User is verified and can login!${colors.reset}`)
    } else {
      console.log(`\n${colors.yellow}⚠️  User is NOT verified yet${colors.reset}`)
      console.log(`   They need to click the verification link in their email.`)
      
      // Check for pending verification tokens
      const VerificationTokenSchema = new mongoose.Schema({
        userId: mongoose.Schema.Types.ObjectId,
        tokenHash: String,
        expiresAt: Date,
      }, { timestamps: true })
      
      const VerificationToken = mongoose.models.VerificationToken || 
                               mongoose.model('VerificationToken', VerificationTokenSchema)
      
      const tokens = await VerificationToken.find({ userId: user._id })
      
      if (tokens.length > 0) {
        console.log(`\n   ${colors.cyan}Pending verification tokens: ${tokens.length}${colors.reset}`)
        tokens.forEach((token, i) => {
          const expired = token.expiresAt.getTime() < Date.now()
          const status = expired ? `${colors.red}EXPIRED${colors.reset}` : `${colors.green}VALID${colors.reset}`
          console.log(`   ${i + 1}. Created: ${token.createdAt.toLocaleString()} - Status: ${status}`)
        })
      } else {
        console.log(`\n   ${colors.red}No verification tokens found${colors.reset}`)
        console.log(`   User needs to request a new verification email.`)
      }
    }

    console.log()
    await mongoose.connection.close()
    
  } catch (error) {
    console.error(`\n${colors.red}❌ Error:${colors.reset}`, error.message)
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
    }
    process.exit(1)
  }
}

// Run the script
checkUser()

