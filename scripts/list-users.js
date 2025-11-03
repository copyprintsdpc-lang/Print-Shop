#!/usr/bin/env node

/**
 * List All Users Script
 * 
 * This script displays all users in the database with their details
 * so you can review and decide which ones to delete.
 * 
 * Usage:
 *   node scripts/list-users.js [--format=table|json|csv]
 */

require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const fs = require('fs')

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
}

// Get format from command line args
const args = process.argv.slice(2)
const formatArg = args.find(arg => arg.startsWith('--format='))
const format = formatArg ? formatArg.split('=')[1] : 'table'

async function listUsers() {
  try {
    console.log(`\n${colors.cyan}👥 List All Users${colors.reset}\n`)
    console.log('=' .repeat(80))
    
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
      createdAt: Date,
      updatedAt: Date,
    }, { timestamps: true })
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema)

    // Fetch all users
    console.log(`\n${colors.blue}📊 Fetching users...${colors.reset}`)
    const users = await User.find({}).sort({ createdAt: -1 })
    
    if (users.length === 0) {
      console.log(`\n${colors.yellow}No users found in database.${colors.reset}\n`)
      await mongoose.connection.close()
      process.exit(0)
    }

    console.log(`${colors.green}✅ Found ${users.length} users${colors.reset}\n`)

    // Display based on format
    if (format === 'json') {
      displayJSON(users)
    } else if (format === 'csv') {
      displayCSV(users)
    } else {
      displayTable(users)
    }

    // Display summary
    displaySummary(users)

    // Close connection
    await mongoose.connection.close()
    console.log(`\n${colors.blue}📡 Database connection closed${colors.reset}\n`)
    
  } catch (error) {
    console.error(`\n${colors.red}❌ Error:${colors.reset}`, error.message)
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
    }
    process.exit(1)
  }
}

function displayTable(users) {
  console.log('=' .repeat(80))
  console.log(`${colors.cyan}ALL USERS IN DATABASE${colors.reset}`)
  console.log('=' .repeat(80))
  console.log()

  users.forEach((user, index) => {
    const roleColor = getRoleColor(user.role)
    const verifiedIcon = user.verified ? '✅' : '❌'
    const roleDisplay = user.role || 'no-role'
    
    console.log(`${colors.cyan}#${index + 1}${colors.reset} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`   ${colors.yellow}ID:${colors.reset}       ${user._id}`)
    console.log(`   ${colors.yellow}Email:${colors.reset}    ${user.email || colors.gray + 'not set' + colors.reset}`)
    console.log(`   ${colors.yellow}Name:${colors.reset}     ${user.name || colors.gray + 'not set' + colors.reset}`)
    console.log(`   ${colors.yellow}Mobile:${colors.reset}   ${user.mobile || colors.gray + 'not set' + colors.reset}`)
    console.log(`   ${colors.yellow}Role:${colors.reset}     ${roleColor}${roleDisplay}${colors.reset}`)
    console.log(`   ${colors.yellow}Verified:${colors.reset} ${verifiedIcon} ${user.verified ? 'Yes' : 'No'}`)
    console.log(`   ${colors.yellow}Created:${colors.reset}  ${formatDate(user.createdAt)}`)
    console.log(`   ${colors.yellow}Updated:${colors.reset}  ${formatDate(user.updatedAt)}`)
    console.log()
  })

  console.log('=' .repeat(80))
}

function displayJSON(users) {
  const userData = users.map(user => ({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    mobile: user.mobile,
    role: user.role,
    verified: user.verified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }))

  console.log(JSON.stringify(userData, null, 2))
  
  // Save to file
  const filename = `users-export-${Date.now()}.json`
  fs.writeFileSync(filename, JSON.stringify(userData, null, 2))
  console.log(`\n${colors.green}✅ Saved to ${filename}${colors.reset}`)
}

function displayCSV(users) {
  console.log('ID,Email,Name,Mobile,Role,Verified,Created,Updated')
  
  const csvLines = users.map(user => {
    return [
      user._id,
      user.email || '',
      user.name || '',
      user.mobile || '',
      user.role || 'no-role',
      user.verified ? 'Yes' : 'No',
      user.createdAt ? user.createdAt.toISOString() : '',
      user.updatedAt ? user.updatedAt.toISOString() : '',
    ].map(field => `"${field}"`).join(',')
  })

  csvLines.forEach(line => console.log(line))

  // Save to file
  const filename = `users-export-${Date.now()}.csv`
  const csvContent = 'ID,Email,Name,Mobile,Role,Verified,Created,Updated\n' + csvLines.join('\n')
  fs.writeFileSync(filename, csvContent)
  console.log(`\n${colors.green}✅ Saved to ${filename}${colors.reset}`)
}

function displaySummary(users) {
  const summary = {
    total: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    admins: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    noRole: users.filter(u => !u.role).length,
    verified: users.filter(u => u.verified).length,
    unverified: users.filter(u => !u.verified).length,
  }

  console.log(`\n${colors.cyan}📊 SUMMARY${colors.reset}`)
  console.log('─'.repeat(80))
  console.log(`   Total Users:           ${summary.total}`)
  console.log(`   ${colors.yellow}├─ Customers:          ${summary.customers}${colors.reset}`)
  console.log(`   ${colors.green}├─ Admins:             ${summary.admins}${colors.reset}`)
  console.log(`   ${colors.green}├─ Staff:              ${summary.staff}${colors.reset}`)
  console.log(`   ${colors.gray}└─ No Role:            ${summary.noRole}${colors.reset}`)
  console.log()
  console.log(`   ${colors.green}✅ Verified:            ${summary.verified}${colors.reset}`)
  console.log(`   ${colors.red}❌ Unverified:          ${summary.unverified}${colors.reset}`)
  console.log('─'.repeat(80))

  // Export instructions
  console.log(`\n${colors.cyan}💡 NEXT STEPS${colors.reset}`)
  console.log(`   To delete specific users:`)
  console.log(`   ${colors.yellow}node scripts/delete-specific-users.js email1@example.com email2@example.com${colors.reset}`)
  console.log()
  console.log(`   To export in different format:`)
  console.log(`   ${colors.yellow}node scripts/list-users.js --format=json${colors.reset}`)
  console.log(`   ${colors.yellow}node scripts/list-users.js --format=csv${colors.reset}`)
}

function getRoleColor(role) {
  switch (role) {
    case 'admin':
    case 'staff':
      return colors.green
    case 'customer':
      return colors.yellow
    default:
      return colors.gray
  }
}

function formatDate(date) {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Run the script
listUsers()

