/**
 * Update existing users' verification status
 * Run this script once after deploying the verification system
 */

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables')
  process.exit(1)
}

// Define User Schema (simplified)
const UserSchema = new mongoose.Schema({
  email: String,
  verified: Boolean,
  emailVerifiedAt: Date,
  mobile: String,
  mobileVerified: Boolean,
  mobileVerifiedAt: Date,
  addresses: [{
    label: String,
    line1: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean,
    isVerified: Boolean,
    verifiedAt: Date,
    verificationMethod: String
  }],
  profileComplete: Boolean,
  canOrder: Boolean
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function updateUserVerification() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    const users = await User.find({})
    console.log(`📊 Found ${users.length} users\n`)

    let updated = 0
    let errors = 0

    for (const user of users) {
      try {
        let needsUpdate = false

        // Set emailVerifiedAt if verified but no timestamp
        if (user.verified && !user.emailVerifiedAt) {
          user.emailVerifiedAt = user.createdAt || new Date()
          needsUpdate = true
          console.log(`  📧 Setting emailVerifiedAt for ${user.email}`)
        }

        // Set mobileVerifiedAt if verified but no timestamp
        if (user.mobileVerified && !user.mobileVerifiedAt) {
          user.mobileVerifiedAt = user.updatedAt || new Date()
          needsUpdate = true
          console.log(`  📱 Setting mobileVerifiedAt for ${user.email}`)
        }

        // Update address schema if needed
        if (user.addresses && user.addresses.length > 0) {
          user.addresses.forEach((addr, index) => {
            // Add isVerified field if missing
            if (addr.isVerified === undefined) {
              // For existing addresses, mark first one as verified if user has orders
              // Or mark all as unverified for safety
              addr.isVerified = false
              needsUpdate = true
            }

            // Ensure required fields exist
            if (!addr.label) addr.label = index === 0 ? 'Home' : 'Other'
            if (!addr.type) addr.type = 'both'
          })
        }

        // Calculate profile status
        const hasVerifiedAddress = user.addresses.some(a => a.isVerified)
        const oldProfileComplete = user.profileComplete
        const oldCanOrder = user.canOrder
        
        user.profileComplete = user.verified && user.mobileVerified && user.addresses.length > 0
        user.canOrder = user.verified && user.mobileVerified && hasVerifiedAddress

        if (user.profileComplete !== oldProfileComplete || user.canOrder !== oldCanOrder) {
          needsUpdate = true
          console.log(`  ✓ Updated status for ${user.email}:`)
          console.log(`    - profileComplete: ${oldProfileComplete} → ${user.profileComplete}`)
          console.log(`    - canOrder: ${oldCanOrder} → ${user.canOrder}`)
        }

        if (needsUpdate) {
          await user.save()
          updated++
          console.log(`  ✅ Updated ${user.email}\n`)
        }
      } catch (err) {
        console.error(`  ❌ Error updating ${user.email}:`, err.message)
        errors++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 Update Summary:')
    console.log(`   Total users: ${users.length}`)
    console.log(`   ✅ Updated: ${updated}`)
    console.log(`   ⏭️  Skipped: ${users.length - updated - errors}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log('='.repeat(60))

    // Show verification stats
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          emailVerified: { $sum: { $cond: ['$verified', 1, 0] } },
          phoneVerified: { $sum: { $cond: ['$mobileVerified', 1, 0] } },
          canOrder: { $sum: { $cond: ['$canOrder', 1, 0] } },
          total: { $sum: 1 }
        }
      }
    ])

    if (stats.length > 0) {
      const s = stats[0]
      console.log('\n📈 Verification Statistics:')
      console.log(`   Total Users: ${s.total}`)
      console.log(`   Email Verified: ${s.emailVerified} (${Math.round(s.emailVerified / s.total * 100)}%)`)
      console.log(`   Phone Verified: ${s.phoneVerified} (${Math.round(s.phoneVerified / s.total * 100)}%)`)
      console.log(`   Can Place Orders: ${s.canOrder} (${Math.round(s.canOrder / s.total * 100)}%)`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n👋 Connection closed')
  }
}

// Run the update
updateUserVerification()

