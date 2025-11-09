import mongoose, { Schema, Document } from 'mongoose'

export interface IService extends Document {
  title: string
  slug: string
  description?: string
  priceRange?: string
  isActive: boolean
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, maxlength: 1000 },
    priceRange: { type: String, maxlength: 120 },
    isActive: { type: Boolean, default: true },
    updatedBy: { type: String },
  },
  { timestamps: true }
)

ServiceSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (this.slug) {
    this.slug = this.slug
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  next()
})

ServiceSchema.index({ slug: 1 }, { unique: true })
ServiceSchema.index({ isActive: 1 })

const ServiceModel = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)

export default ServiceModel

