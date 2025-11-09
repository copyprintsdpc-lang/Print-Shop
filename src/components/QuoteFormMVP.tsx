'use client'

import { useState } from 'react'
import { Upload, Send, CheckCircle, AlertCircle, Loader2, MapPin, Truck, Phone, Mail, MessageSquare, Image, FileText, File, X } from 'lucide-react'
import FileUpload from './FileUpload'

export default function QuoteFormMVP() {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    message: '',
    quantity: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery'
  })
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [fileQuantities, setFileQuantities] = useState<Record<string, number>>({})
  const [fileColorModes, setFileColorModes] = useState<Record<string, 'color' | 'grayscale'>>({})
  const [filePaperSizes, setFilePaperSizes] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const hasUploadingFiles = uploadedFiles.some(file => file.uploading)

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
    // Initialize quantity to 1, colorMode to 'color', and paperSize to 'A4' for new files
    const newQuantities = { ...fileQuantities }
    const newColorModes = { ...fileColorModes }
    const newPaperSizes = { ...filePaperSizes }
    files.forEach((file) => {
      const fileId = file.id || file.key || file.url || file.file?.name || Math.random().toString()
      if (!newQuantities[fileId]) {
        newQuantities[fileId] = 1
      }
      if (!newColorModes[fileId]) {
        newColorModes[fileId] = 'color' // Default to color
      }
      if (!newPaperSizes[fileId]) {
        newPaperSizes[fileId] = 'A4 (8.3" × 11.7")' // Default paper size
      }
    })
    setFileQuantities(newQuantities)
    setFileColorModes(newColorModes)
    setFilePaperSizes(newPaperSizes)
  }

  const resetForm = () => {
    setFormData({
      phone: '',
      email: '',
      address: '',
      message: '',
      quantity: '',
      deliveryMethod: 'pickup'
    })
    setUploadedFiles([])
    setFileQuantities({})
    setFileColorModes({})
    setFilePaperSizes({})
    setSubmitStatus('idle')
    setOrderNumber(null)
    setErrorMessage('')
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    resetForm()
  }

  const handleQuantityChange = (fileId: string, quantity: number) => {
    setFileQuantities(prev => ({
      ...prev,
      [fileId]: Math.max(1, quantity) // Ensure minimum 1
    }))
  }

  const handleColorModeChange = (fileId: string, colorMode: 'color' | 'grayscale') => {
    setFileColorModes(prev => ({
      ...prev,
      [fileId]: colorMode
    }))
  }

  const handlePaperSizeChange = (fileId: string, paperSize: string) => {
    setFilePaperSizes(prev => ({
      ...prev,
      [fileId]: paperSize
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.phone) {
      setSubmitStatus('error')
      setErrorMessage('Phone number is required')
      return
    }

    // Check if files are uploaded (uploaded to storage)
    const hasUploadedFiles = uploadedFiles.some(f => f.key || f.url || f.uploaded)
    const hasFiles = uploadedFiles.length > 0
    
    if (!hasFiles) {
      setSubmitStatus('error')
      setErrorMessage('Please upload at least one file')
      return
    }
    
    // Warn if files are not yet uploaded (but allow submission as fallback)
    const unuploadedFiles = uploadedFiles.filter(f => !f.key && !f.url && !f.uploaded)
    if (unuploadedFiles.length > 0 && !hasUploadedFiles) {
      setSubmitStatus('error')
      setErrorMessage('Please wait for files to finish uploading before submitting')
      return
    }

    // Validate that all uploaded files have quantities
    const uploadedFilesWithIds = uploadedFiles.filter(f => f.key || f.url || f.uploaded)
    for (const file of uploadedFilesWithIds) {
      const fileId = file.id || file.key || file.url || file.file?.name || ''
      const quantity = fileQuantities[fileId]
      if (!quantity || quantity < 1) {
        setSubmitStatus('error')
        setErrorMessage(`Please enter quantity for all files (minimum 1)`)
        return
      }
    }

    // Validate delivery address if delivery method is selected
    if (formData.deliveryMethod === 'delivery' && (!formData.address || !formData.address.trim())) {
      setSubmitStatus('error')
      setErrorMessage('Please provide a delivery address')
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
      formDataToSend.append('deliveryMethod', formData.deliveryMethod)

      // Prepare files with quantities, color modes, and paper sizes (files are already uploaded to storage)
      const filesWithQuantities: Array<{key: string, url?: string, quantity: number, name: string, colorMode: 'color' | 'grayscale', paperSize: string}> = []
      uploadedFiles.forEach((fileObj) => {
        // If file is uploaded, include it with quantity, colorMode, and paperSize
        if (fileObj.key) {
          const fileId = fileObj.id || fileObj.key || fileObj.file?.name || ''
          const quantity = fileQuantities[fileId] || 1
          const colorMode = fileColorModes[fileId] || 'color'
          const paperSize = filePaperSizes[fileId] || 'A4 (8.3" × 11.7")'
          filesWithQuantities.push({
            key: fileObj.key,
            url: fileObj.url || fileObj.previewUrl,
            quantity: quantity,
            name: fileObj.file?.name || fileObj.name || 'Unknown',
            colorMode: colorMode,
            paperSize: paperSize
          })
        } else if (fileObj.file) {
          // Fallback: if file wasn't uploaded, send the file (will be uploaded by API)
          formDataToSend.append('files', fileObj.file)
        }
      })
      
      // Send files with quantities as JSON
      if (filesWithQuantities.length > 0) {
        formDataToSend.append('filesWithQuantities', JSON.stringify(filesWithQuantities))
      }
      
      // Calculate and send total quantity (for backward compatibility)
      const totalQuantity = filesWithQuantities.reduce((sum, file) => sum + file.quantity, 0)
      formDataToSend.append('quantity', totalQuantity.toString())

      // Send to API
      const response = await fetch('/api/quote-mvp', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Failed to submit quote request')
      }

      setSubmitStatus('success')
      setOrderNumber(result.quoteNumber || null)
      setErrorMessage('')
      setShowSuccessModal(true)

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
          maxSize={100}
          acceptedTypes={[
            'image/jpeg', 
            'image/png', 
            'image/jpg', 
            'application/pdf', 
            'image/svg+xml',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/msword' // .doc (older Word format)
          ]}
          autoUpload={true}
          showUploadButton={false}
          uploadEndpoint="/api/artwork/upload"
          folder="quotes"
          showFileSummary={false}
        />
        <p className="text-xs text-gray-500 mt-2">
          Accepted: JPG, PNG, PDF, SVG, DOC, DOCX (Word). Max 50MB per file. Files upload automatically when selected.
        </p>
      </div>

      {/* Files Table */}
      {uploadedFiles.length > 0 && uploadedFiles.some(f => f.key || f.uploaded) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Configure File Details *
          </label>
          <div className="space-y-6">
            {uploadedFiles
              .filter(f => f.key || f.uploaded)
              .map((fileObj, index) => {
                const fileId = fileObj.id || fileObj.key || fileObj.url || fileObj.file?.name || index.toString()
                const quantity = fileQuantities[fileId] || 1
                const colorMode = fileColorModes[fileId] || 'color'
                const paperSize = filePaperSizes[fileId] || 'A4 (8.3" × 11.7")'
                const fileName = fileObj.file?.name || fileObj.name || 'Unknown'
                const fileType = fileObj.file?.type || ''
                
                let fileTypeDisplay = 'File'
                let fileIcon = <File className="w-6 h-6 text-gray-500" />
                if (fileType.includes('image/')) {
                  fileTypeDisplay = 'Image'
                  fileIcon = <Image className="w-6 h-6 text-blue-500" />
                  if (fileType.includes('jpeg') || fileType.includes('jpg')) fileTypeDisplay = 'JPEG'
                  if (fileType.includes('png')) fileTypeDisplay = 'PNG'
                  if (fileType.includes('svg')) fileTypeDisplay = 'SVG'
                } else if (fileType === 'application/pdf') {
                  fileTypeDisplay = 'PDF'
                  fileIcon = <FileText className="w-6 h-6 text-red-500" />
                } else if (fileType.includes('word') || fileType === 'application/msword') {
                  fileTypeDisplay = 'Word'
                  fileIcon = <FileText className="w-6 h-6 text-blue-500" />
                }
                
                return (
                  <div
                    key={fileId}
                    className="border border-gray-200 rounded-2xl bg-white shadow-sm"
                  >
                    <div className="px-4 py-4 md:px-6 md:py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {fileIcon}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 break-words">
                            {fileName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {fileTypeDisplay.toUpperCase()}
                            {(fileObj.file?.size || fileObj.size || 0) > 0 && ` • ${((fileObj.file?.size || fileObj.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                          </p>
                        </div>
                      </div>
                      {fileObj.uploaded && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Uploaded
                        </span>
                      )}
                    </div>

                    <div className="px-4 py-4 md:px-6 md:py-5 bg-gray-50 rounded-b-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:items-end">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Colour Mode
                          </label>
                          <select
                            value={colorMode}
                            onChange={(e) => handleColorModeChange(fileId, e.target.value as 'color' | 'grayscale')}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          >
                            <option value="color">Colour</option>
                            <option value="grayscale">Black & White</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Paper Size
                          </label>
                          <select
                            value={paperSize}
                            onChange={(e) => handlePaperSizeChange(fileId, e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          >
                            {paperSizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Copies
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(fileId, quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                              aria-label="Decrease copies"
                            >
                              <span className="text-lg leading-none">−</span>
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => handleQuantityChange(fileId, parseInt(e.target.value) || 1)}
                              className="w-16 text-center px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(fileId, quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                              aria-label="Increase copies"
                            >
                              <span className="text-lg leading-none">+</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Adjust colour, paper size, and copies for each file. Minimum one copy per file.
          </p>
        </div>
      )}

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

      {/* Address - Required (only if delivery) */}
      {formData.deliveryMethod === 'delivery' && (
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Delivery Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your complete delivery address..."
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
        disabled={isSubmitting || hasUploadingFiles}
        className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          isSubmitting || hasUploadingFiles ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : hasUploadingFiles ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading files...
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

      {/* Success Modal */}
      {showSuccessModal && orderNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleSuccessModalClose}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-green-100 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={handleSuccessModalClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-green-900 hover:bg-green-50 transition-colors"
              aria-label="Close success dialog"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-6 md:p-8 bg-green-50/80">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                  <CheckCircle className="w-7 h-7" />
                </span>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-green-900 mb-1">
                    Quote Request Submitted Successfully!
                  </h2>
                  <p className="text-sm text-green-800">
                    We’ve received your files. You’ll get a confirmation email and a WhatsApp message with the details shortly.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-xl border-2 border-green-400 bg-white px-5 py-4">
                <p className="text-sm text-gray-600">Your Quote Number</p>
                <p className="mt-1 text-2xl md:text-3xl font-extrabold text-green-700 tracking-wide">
                  {orderNumber}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Save this number for future reference or follow-ups.
                </p>
              </div>
            </div>
            <div className="px-6 md:px-8 py-4 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-600">
                Need urgent assistance? Call us <a href="tel:+918897379737" className="font-semibold text-green-700">+91 8897379737</a>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSuccessModalClose}
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  Submit another quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

