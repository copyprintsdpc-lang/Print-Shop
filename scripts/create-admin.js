#!/usr/bin/env node

/**
 * Script to create a dummy admin account
 * 
 * Usage: node scripts/create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sdpc-print-shop';

async function createAdmin() {
  try {
    console.log('\n🔐 Creating Dummy Admin Account...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');

    const adminsToSeed = [
      {
        email: 'owner@sdpc.com',
        password: 'Owner#543!@',
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
        ]
      },
      {
        email: 'staff@sdpc.com',
        password: 'Staff#543!@',
        name: 'Operations Staff',
        role: 'staff',
        permissions: [
          'dashboard.read',
          'operations.access',
          'quotes.manage',
          'pickups.manage',
          'products.read',
          'orders.read',
          'orders.update'
        ]
      }
    ];

    const results = [];

    for (const adminSeed of adminsToSeed) {
      const existing = await mongoose.connection.db.collection('admins').findOne({ email: adminSeed.email });

      if (existing) {
        results.push({ ...adminSeed, status: 'exists' });
        continue;
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(adminSeed.password, salt);

      await mongoose.connection.db.collection('admins').insertOne({
        email: adminSeed.email,
        passwordHash,
        name: adminSeed.name,
        role: adminSeed.role,
        permissions: adminSeed.permissions,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      results.push({ ...adminSeed, status: 'created' });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    for (const account of results) {
      console.log(account.status === 'created' ? '✅ Admin account ready' : 'ℹ️  Admin account already present');
      console.log(`   📧 Email:    ${account.email}`);
      console.log(`   🔑 Password: ${account.password}`);
      console.log(`   👤 Role:     ${account.role === 'owner' ? 'Owner / Super Admin' : 'Staff Operator'}`);
      console.log('   📍 Login:    http://localhost:3000/admin/login');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
    console.log('⚠️  Remember to change these passwords in production!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin account:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdmin();

