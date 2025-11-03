#!/usr/bin/env node

/**
 * Delete Specific Users Script
 * 
 * This script deletes specific users by email or ID.
 * 
 * Usage:
 *   node scripts/delete-specific-users.js email1@example.com email2@example.com
 *   node scripts/delete-specific-users.js --id=userId1 --id=userId2
 *   node scripts/delete-specific-users.js email@example.com --confirm
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

async function deleteSpecificUsers() {
  try {
    console.log(`\n${colors.cyan}🗑️  Delete Specific Users${colors.reset}\n`)
    console.log('=' .repeat(80))
    
    // Parse arguments
    const args = process.argv.slice(2)
    const hasConfirm = args.includes('--confirm')
    const targets = args.filter(arg => !arg.startsWith('--'))
    const idArgs = args.filter(arg => arg.startsWith('--id=')).map(arg => arg.split('=')[1])

    if (targets.length === 0 && idArgs.length === 0) {
      console.log(`${colors.yellow}Usage:${colors.reset}`)
      console.log(`   By email: node scripts/delete-specific-users.js email1@example.com email2@example.com`)
      console.log(`   By ID:    node scripts/delete-specific-users.js --id=userId1 --id=userId2`)
      console.log(`   Mixed:    node scripts/delete-specific-users.js email@example.com --id=userId`)
      console.log(`\n${colors.yellow}Add --confirm to actually delete${colors.reset}\n`)
      process.exit(0)
    }

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      console.error(`${colors.red}❌ Error: MONGODB_URI not found in .env.local${colors.reset}`)
      process.exit(1)
    }

    console.log(`\n${colors.blue}📡 Connecting to MongoDB...${colors.reset}`)
    await mongoose.connect(MONGODB_URI)
    console.log(`${colors.green}✅ Connected to database${colors.reset}`)

    // Get User model
    const UserSchema = new mongoose.Schema({
      email: String,
      name: String,
      mobile: String,
      role: String,
      verified: Boolean,
    }, { timestamps: true })
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema)

    // Build query
    const query = {
      $or: [
        ...targets.map(email => ({ email: email.toLowerCase() })),
        ...idArgs.map(id => ({ _id: id }))
      ]
    }

    // Find matching users
    console.log(`\n${colors.blue}🔍 Finding users...${colors.reset}`)
    const usersToDelete = await User.find(query)

    if (usersToDelete.length === 0) {
      console.log(`\n${colors.yellow}❌ No users found matching the criteria${colors.reset}`)
      console.log(`   Searched for: ${[...targets, ...idArgs].join(', ')}`)
      await mongoose.connection.close()
      process.exit(0)
    }

    // Display users that will be deleted
    console.log(`\n${colors.cyan}📋 Found ${usersToDelete.length} user(s) to delete:${colors.reset}\n`)
    
    usersToDelete.forEach((user, index) => {
      const roleColor = user.role === 'admin' || user.role === 'staff' ? colors.red : colors.yellow
      const warningIcon = user.role === 'admin' || user.role === 'staff' ? '⚠️ ' : ''
      
      console.log(`${colors.cyan}#${index + 1}${colors.reset} ──────────────────────────────────`)
      console.log(`   ${warningIcon}Email:    ${user.email || 'not set'}`)
      console.log(`   Name:     ${user.name || 'not set'}`)
      console.log(`   Role:     ${roleColor}${user.role || 'no-role'}${colors.reset}`)
      console.log(`   Verified: ${user.verified ? '✅ Yes' : '❌ No'}`)
      console.log(`   ID:       ${user._id}`)
      console.log()
    })

    // Check for admin/staff users
    const adminUsers = usersToDelete.filter(u => u.role === 'admin' || u.role === 'staff')
    if (adminUsers.length > 0) {
      console.log(`${colors.red}⚠️  WARNING: ${adminUsers.length} admin/staff account(s) will be deleted!${colors.reset}`)
      adminUsers.forEach(u => {
        console.log(`   ${colors.red}└─ ${u.email} (${u.role})${colors.reset}`)
      })
      console.log()
    }

    // Check for confirmation
    if (!hasConfirm) {
      console.log(`${colors.yellow}🛡️  Safety Check: Add --confirm to proceed${colors.reset}`)
      console.log(`   Run this command to delete:`)
      console.log(`   ${colors.cyan}node scripts/delete-specific-users.js ${args.filter(a => a !== '--confirm').join(' ')} --confirm${colors.reset}\n`)
      await mongoose.connection.close()
      process.exit(0)
    }

    // Delete users
    console.log(`${colors.yellow}⏳ Deleting users...${colors.reset}`)
    const result = await User.deleteMany(query)
    
    console.log(`${colors.green}✅ Deletion complete!${colors.reset}`)
    console.log(`   Deleted: ${result.deletedCount} user(s)`)
    
    // Show remaining count
    const remainingUsers = await User.countDocuments()
    console.log(`\n${colors.cyan}Remaining users in database: ${remainingUsers}${colors.reset}`)
    
    console.log(`\n${'='.repeat(80)}`)
    console.log(`${colors.green}✅ Success! Users deleted.${colors.reset}`)
    console.log('=' .repeat(80) + '\n')
    
    // Close connection
    await mongoose.connection.close()
    console.log(`${colors.blue}📡 Database connection closed${colors.reset}\n`)
    
  } catch (error) {
    console.error(`\n${colors.red}❌ Error:${colors.reset}`, error.message)
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
    }
    process.exit(1)
  }
}

// Run the script
deleteSpecificUsers()

