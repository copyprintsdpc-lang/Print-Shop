import { Schema, model, models } from 'mongoose'

// Unified user schema to support both email/password and optional OTP/mobile flows
const UserSchema = new Schema({
  email: { type: String, unique: true, required: false, index: true, trim: true, lowercase: true, sparse: true },
  passwordHash: { type: String, required: false },
  verified: { type: Boolean, default: false }, // Email verified
  emailVerifiedAt: { type: Date },

  // Contact Information
  name: { type: String, required: false, trim: true },
  mobile: { type: String, required: false, unique: true, sparse: true, trim: true },
  mobileVerified: { type: Boolean, default: false },
  mobileVerifiedAt: { type: Date },
  
  role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
  
  // Business Profile (optional)
  businessProfile: {
    companyName: String,
    gstin: String,
    pan: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'IN' },
    },
  },
  
  // Delivery Addresses
  addresses: [{
    type: { type: String, enum: ['billing', 'shipping', 'both'], default: 'both' },
    label: { type: String, default: 'Home' }, // Home, Office, etc.
    contactName: String,
    contactPhone: String,
    line1: { type: String, required: true },
    line2: String,
    landmark: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'IN' },
    isDefault: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    verificationMethod: { type: String, enum: ['manual', 'delivery', 'pickup'] }
  }],
  
  // Profile Completion
  profileComplete: { type: Boolean, default: false },
  canOrder: { type: Boolean, default: false }, // Can place orders only if verified
  
}, { timestamps: true })

// Indexes are already defined via field-level 'index' and 'unique' where applicable.
// Keeping only essential compound or TTL indexes in other models.

const User = models.User || model('User', UserSchema)
export default User
