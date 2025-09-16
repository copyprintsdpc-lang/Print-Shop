import { Schema, model, models } from 'mongoose'

// Unified user schema to support both email/password and optional OTP/mobile flows
const UserSchema = new Schema({
  email: { type: String, unique: true, required: true, index: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: false },
  verified: { type: Boolean, default: false },

  // Optional fields used by legacy OTP flow and profile data
  name: { type: String, required: false, trim: true },
  mobile: { type: String, required: false, unique: true, sparse: true, trim: true },
  role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
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
  addresses: [{
    type: { type: String, enum: ['billing', 'shipping'] },
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'IN' },
    isDefault: { type: Boolean, default: false },
  }],
}, { timestamps: true })

// Indexes are already defined via field-level 'index' and 'unique' where applicable.
// Keeping only essential compound or TTL indexes in other models.

const User = models.User || model('User', UserSchema)
export default User
