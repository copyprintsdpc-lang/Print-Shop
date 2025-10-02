import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'super_admin' | 'admin' | 'staff';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'staff'],
    default: 'staff',
  },
  permissions: [{
    type: String,
    enum: [
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
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

