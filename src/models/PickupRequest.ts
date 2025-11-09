import mongoose, { Schema, Document } from 'mongoose'

export interface IPickupFile {
  key: string
  url?: string
  name: string
  size?: number
  colorMode?: 'color' | 'grayscale'
  paperSize?: string
  copies: number
}

export interface IPickupRequest extends Document {
  pickupCode: string
  customer: {
    phone?: string
    email?: string
  }
  files: IPickupFile[]
  status: 'new' | 'printed' | 'collected'
  createdAt: Date
  updatedAt: Date
}

const PickupFileSchema = new Schema<IPickupFile>({
  key: { type: String, required: true },
  url: { type: String },
  name: { type: String, required: true },
  size: { type: Number },
  colorMode: { type: String, enum: ['color', 'grayscale'], default: 'color' },
  paperSize: { type: String },
  copies: { type: Number, required: true, default: 1 },
})

const PickupRequestSchema = new Schema<IPickupRequest>(
  {
    pickupCode: { type: String, required: true, unique: true, index: true },
    customer: {
      phone: { type: String },
      email: { type: String },
    },
    files: { type: [PickupFileSchema], required: true },
    status: {
      type: String,
      enum: ['new', 'printed', 'collected'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.PickupRequest ||
  mongoose.model<IPickupRequest>('PickupRequest', PickupRequestSchema)

