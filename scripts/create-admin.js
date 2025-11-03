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

    // Check if admin already exists
    const existingAdmin = await mongoose.connection.db.collection('admins').findOne({ email: 'admin@sdpc.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists with email: admin@sdpc.com');
      console.log('   Password: Admin@123');
      console.log('   You can use this account to login\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('Admin@123', salt);

    // Create admin user
    const admin = {
      email: 'admin@sdpc.com',
      passwordHash: passwordHash,
      name: 'Admin User',
      role: 'super_admin',
      permissions: [
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
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert admin
    await mongoose.connection.db.collection('admins').insertOne(admin);
    
    console.log('✅ Admin account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📧 Email:    admin@sdpc.com');
    console.log('   🔑 Password: Admin@123');
    console.log('   👤 Role:     Super Admin');
    console.log('   📍 Login:    http://localhost:3000/admin/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  Remember to change this password in production!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin account:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdmin();

