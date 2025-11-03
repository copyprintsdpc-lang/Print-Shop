#!/usr/bin/env node

/**
 * Delete Users Script
 * 
 * This script safely deletes all customer users from the database
 * while preserving admin and staff accounts.
 * 
 * Usage:
 *   node scripts/delete-users.js [--confirm]
 */

require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

async function deleteUsers() {
  try {
    console.log(`\n${colors.cyan}🗑️  Delete Users Script${colors.reset}\n`)
    console.log('=' .repeat(60))
    
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

    // Count users before deletion
    console.log(`\n${colors.blue}📊 Analyzing database...${colors.reset}`)
    
    const totalUsers = await User.countDocuments()
    const customerUsers = await User.countDocuments({ role: 'customer' })
    const adminUsers = await User.countDocuments({ role: 'admin' })
    const staffUsers = await User.countDocuments({ role: 'staff' })
    const noRoleUsers = await User.countDocuments({ role: { $exists: false } })
    
    console.log(`\n${colors.cyan}Current Database Status:${colors.reset}`)
    console.log(`   Total Users:         ${totalUsers}`)
    console.log(`   ${colors.yellow}└─ Customers:        ${customerUsers}${colors.reset}`)
    console.log(`   ${colors.green}└─ Admins:           ${adminUsers}${colors.reset}`)
    console.log(`   ${colors.green}└─ Staff:            ${staffUsers}${colors.reset}`)
    if (noRoleUsers > 0) {
      console.log(`   ${colors.yellow}└─ No Role:          ${noRoleUsers}${colors.reset}`)
    }

    // Check if there are users to delete
    const usersToDelete = customerUsers + noRoleUsers
    
    if (usersToDelete === 0) {
      console.log(`\n${colors.green}✅ No customer users to delete!${colors.reset}`)
      console.log(`   All ${totalUsers} users are admin or staff accounts.`)
      await mongoose.connection.close()
      process.exit(0)
    }

    // Warning message
    console.log(`\n${colors.red}⚠️  WARNING!${colors.reset}`)
    console.log(`   This will permanently delete ${colors.red}${usersToDelete} users${colors.reset}`)
    console.log(`   ${colors.green}Keeping ${adminUsers + staffUsers} admin/staff accounts safe${colors.reset}`)
    
    // Check for --confirm flag
    const hasConfirmFlag = process.argv.includes('--confirm')
    
    if (!hasConfirmFlag) {
      console.log(`\n${colors.yellow}🛡️  Safety Check: Confirmation Required${colors.reset}`)
      console.log(`   To proceed, run this command:`)
      console.log(`   ${colors.cyan}node scripts/delete-users.js --confirm${colors.reset}\n`)
      await mongoose.connection.close()
      process.exit(0)
    }

    // Proceed with deletion
    console.log(`\n${colors.yellow}⏳ Deleting users...${colors.reset}`)
    
    // Delete customers and users without roles
    const deleteQuery = {
      $or: [
        { role: 'customer' },
        { role: { $exists: false } },
        { role: null }
      ]
    }
    
    const result = await User.deleteMany(deleteQuery)
    
    console.log(`${colors.green}✅ Deletion complete!${colors.reset}`)
    console.log(`   Deleted: ${result.deletedCount} users`)
    
    // Count remaining users
    const remainingUsers = await User.countDocuments()
    const remainingAdmins = await User.countDocuments({ role: 'admin' })
    const remainingStaff = await User.countDocuments({ role: 'staff' })
    
    console.log(`\n${colors.cyan}Final Database Status:${colors.reset}`)
    console.log(`   Total Users:         ${remainingUsers}`)
    console.log(`   ${colors.green}└─ Admins:           ${remainingAdmins}${colors.reset}`)
    console.log(`   ${colors.green}└─ Staff:            ${remainingStaff}${colors.reset}`)
    
    console.log(`\n${'='.repeat(60)}`)
    console.log(`${colors.green}✅ Success! Customer users deleted, admin accounts preserved.${colors.reset}`)
    console.log('=' .repeat(60) + '\n')
    
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
deleteUsers()

