const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(uri, {
      bufferCommands: false,
      maxConnecting: 10,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    
    // Test collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections:');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   ${collection.name}: ${count} documents`);
    }
    
    // Test products query
    console.log('\n📦 Testing products query...');
    const products = await db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products:`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ₹${product.basePrice} (${product.category})`);
    });
    
    // Test admins query
    console.log('\n👤 Testing admins query...');
    const admins = await db.collection('admins').find({}).toArray();
    console.log(`Found ${admins.length} admins:`);
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.email} (${admin.role})`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
  }
}

testConnection();
