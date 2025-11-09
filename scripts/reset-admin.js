#!/usr/bin/env node

/**
 * Danger: wipes the `admins` and `users` collections, then seeds the owner admin.
 *
 * Usage: node scripts/reset-admin.js
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sdpc-print-shop'

const OWNER_EMAIL = 'owner@sdpc.com'
const OWNER_PASSWORD = 'Owner#543!@'

async function resetAdmins() {
  try {
    console.log('\n⚠️  Resetting admin and user collections...\n')

    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to database')

    const db = mongoose.connection.db

    // Purge admins and users
    const deletedAdmins = await db.collection('admins').deleteMany({})
    const deletedUsers = await db.collection('users').deleteMany({ role: { $in: ['admin', 'staff', 'super_admin'] } })

    console.log(`🧹 Removed ${deletedAdmins.deletedCount} admin record(s)`)
    console.log(`🧹 Cleaned ${deletedUsers.deletedCount} related user record(s)\n`)

    const passwordHash = await bcrypt.hash(OWNER_PASSWORD, 12)
    const timestamp = new Date()

    await db.collection('admins').insertOne({
      email: OWNER_EMAIL,
      passwordHash,
      name: 'Owner Admin',
      role: 'owner',
      permissions: [
        'dashboard.read',
        'operations.access',
        'services.manage',
        'quotes.manage',
        'pickups.manage',
        'products.create',
        'products.read',
        'products.update',
        'products.delete',
        'orders.read',
        'orders.update',
        'promotions.create',
        'promotions.read',
        'promotions.update',
        'promotions.delete',
        'users.read',
        'analytics.read',
        'settings.update'
      ],
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastLogin: null
    })

    console.log('✅ Owner admin provisioned\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   📧 Email:    ${OWNER_EMAIL}`)
    console.log(`   🔑 Password: ${OWNER_PASSWORD}`)
    console.log('   👤 Role:     Owner / Super Admin')
    console.log('   📍 Login:    http://localhost:3000/admin/login')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('⚠️  Update the password immediately in production!\n')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Failed to reset admin data:', error.message)
    process.exit(1)
  }
}

resetAdmins()

