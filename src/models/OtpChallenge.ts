import mongoose, { Schema, Document } from 'mongoose';

export interface IOtpChallenge extends Document {
  mobile: string;
  channel: 'sms' | 'whatsapp';
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  status: 'pending' | 'verified' | 'expired';
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const OtpChallengeSchema: Schema = new Schema({
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  channel: {
    type: String,
    enum: ['sms', 'whatsapp'],
    required: true,
  },
  codeHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // Auto-delete expired OTPs
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'expired'],
    default: 'pending',
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries and rate limiting
OtpChallengeSchema.index({ mobile: 1, createdAt: -1 });
OtpChallengeSchema.index({ ipAddress: 1, createdAt: -1 });
OtpChallengeSchema.index({ status: 1, expiresAt: 1 });

// Compound index for mobile + channel + status
OtpChallengeSchema.index({ mobile: 1, channel: 1, status: 1 });

export default mongoose.models.OtpChallenge || mongoose.model<IOtpChallenge>('OtpChallenge', OtpChallengeSchema);
