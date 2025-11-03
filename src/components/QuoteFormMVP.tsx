'use client'

import { useState } from 'react'
import { Upload, Send, CheckCircle, AlertCircle, Loader2, MapPin, Truck, Phone, Mail, MessageSquare } from 'lucide-react'
import FileUpload from './FileUpload'

export default function QuoteFormMVP() {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    message: '',
    size: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery'
  })
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const paperSizes = [
    'A4 (8.3" × 11.7")',
    'A3 (11.7" × 16.5")',
    'A2 (16.5" × 23.4")',
    'A1 (23.4" × 33.1")',
    'Business Card (3.5" × 2")',
    'Poster (18" × 24")',
    'Poster (24" × 36")',
    'Custom Size'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFilesChange = (files: any[]) => {
    setUploadedFiles(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.phone) {
      setSubmitStatus('error')
      setErrorMessage('Phone number is required')
      return
    }

    if (uploadedFiles.length === 0) {
      setSubmitStatus('error')
      setErrorMessage('Please upload at least one file')
      return
    }

    if (!formData.size) {
      setSubmitStatus('error')
      setErrorMessage('Please select a paper size')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Prepare form data
      const formDataToSend = new FormData()
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('email', formData.email || '')
      formDataToSend.append('address', formData.address || '')
      formDataToSend.append('message', formData.message || '')
      formDataToSend.append('size', formData.size)
      formDataToSend.append('deliveryMethod', formData.deliveryMethod)

      // Append uploaded files
      uploadedFiles.forEach((fileObj) => {
        if (fileObj.file) {
          formDataToSend.append('files', fileObj.file)
        }
      })

      // Send to API
      const response = await fetch('/api/quote-mvp', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Failed to submit quote request')
      }

      // Success
      setSubmitStatus('success')
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          phone: '',
          email: '',
          address: '',
          message: '',
          size: '',
          deliveryMethod: 'pickup'
        })
        setUploadedFiles([])
        setSubmitStatus('idle')
      }, 5000)

    } catch (error: any) {
      console.error('Quote request error:', error)
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-800">Quote Request Submitted!</h3>
            <p className="text-sm text-green-700">
              Our team will review your files and send you a quote shortly. We'll contact you on <strong>{formData.phone}</strong>. For urgent queries, call us at <strong>+91 8897379737</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Submission Failed</h3>
            <p className="text-sm text-red-700">{errorMessage}</p>
            <p className="text-sm text-red-600 mt-2">
              Please call customer care at <a href="tel:+918897379737" className="font-semibold underline">+91 8897379737</a> for assistance.
            </p>
          </div>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Upload className="w-4 h-4 inline mr-2" />
          Upload Files *
        </label>
        <FileUpload
          onFilesChange={handleFilesChange}
          maxFiles={10}
          maxSize={50}
          acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'image/svg+xml']}
        />
        <p className="text-xs text-gray-500 mt-2">
          Accepted: JPG, PNG, PDF, SVG. Max 50MB per file.
        </p>
      </div>

      {/* Paper Size Selection */}
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
          Paper Size *
        </label>
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Select size...</option>
          {paperSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* Phone Number - Required */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="+91 9876543210"
        />
      </div>

      {/* Delivery Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Truck className="w-4 h-4 inline mr-2" />
          Delivery Method *
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
            formData.deliveryMethod === 'pickup' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-300'
          }`}>
            <input
              type="radio"
              name="deliveryMethod"
              value="pickup"
              checked={formData.deliveryMethod === 'pickup'}
              onChange={handleChange}
              className="sr-only"
            />
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-gray-900">Store Pickup</p>
              <p className="text-sm text-gray-600">Free - Collect at our store</p>
            </div>
          </label>
          
          <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
            formData.deliveryMethod === 'delivery' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-300'
          }`}>
            <input
              type="radio"
              name="deliveryMethod"
              value="delivery"
              checked={formData.deliveryMethod === 'delivery'}
              onChange={handleChange}
              className="sr-only"
            />
            <div className="text-center">
              <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-gray-900">Delivery</p>
              <p className="text-sm text-gray-600">Extra charges apply</p>
            </div>
          </label>
        </div>
      </div>

      {/* Email - Optional */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="your@email.com"
        />
      </div>

      {/* Address - Optional (only if delivery) */}
      {formData.deliveryMethod === 'delivery' && (
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Enter your delivery address..."
          />
        </div>
      )}

      {/* Message - Optional */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Additional Notes (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Any special instructions or requirements..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Quote Request
          </>
        )}
      </button>

      {/* Help Text */}
      <p className="text-sm text-gray-600 text-center">
        Having trouble submitting? Call our customer care: <a href="tel:+918897379737" className="text-blue-600 font-semibold hover:underline">+91 8897379737</a>
      </p>
    </form>
  )
}

