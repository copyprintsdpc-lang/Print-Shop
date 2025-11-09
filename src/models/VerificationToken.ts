import { Schema, model, models, Types } from 'mongoose'

const VerificationTokenSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true })

// TTL index: only define once here; avoid duplicating via schema options elsewhere
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const VerificationToken = models.VerificationToken || model('VerificationToken', VerificationTokenSchema)
export default VerificationToken


