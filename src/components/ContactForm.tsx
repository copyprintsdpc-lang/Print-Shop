'use client'

import { useState } from 'react'
import { Send, Upload, CheckCircle, AlertCircle, Loader2, MessageCircle, Paperclip } from 'lucide-react'
import FileUpload from './FileUpload'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: 'general',
    message: ''
  })
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'quote', label: 'Request Quote' },
    { value: 'support', label: 'Customer Support' },
    { value: 'bulk', label: 'Bulk Order' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'other', label: 'Other' }
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
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Prepare form data
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('inquiryType', formData.inquiryType)
      formDataToSend.append('message', formData.message)

      // Append uploaded files
      uploadedFiles.forEach((fileObj, index) => {
        if (fileObj.file) {
          formDataToSend.append(`files`, fileObj.file)
        }
      })

      // Send to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      // Success
      setSubmitStatus('success')
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          inquiryType: 'general',
          message: ''
        })
        setUploadedFiles([])
        setSubmitStatus('idle')
      }, 3000)

    } catch (error: any) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border-2 border-blue-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Send us a Message
      </h2>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-800">Message Sent Successfully!</h3>
            <p className="text-sm text-green-700">
              We've received your message and will get back to you within 2 hours.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Failed to Send Message</h3>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Phone and Inquiry Type */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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

          <div>
            <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
              Inquiry Type *
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
              {inquiryTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Brief description of your inquiry"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Tell us more about your inquiry..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Attach Files (Optional)
            </div>
          </label>
          <FileUpload
            onFilesChange={handleFilesChange}
            maxFiles={5}
            maxSize={10}
            acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
          />
          <p className="text-xs text-gray-500 mt-2">
            You can upload PDF, JPG, PNG, or DOC files for quote requests. Max 5 files, 10MB each.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>

        {/* Helpful Notice */}
        <p className="text-sm text-gray-600 text-center">
          <MessageCircle className="w-4 h-4 inline mr-2" />
          We typically respond within 2 hours during business hours (9AM-9PM, Mon-Sat)
        </p>
      </form>
    </div>
  )
}

