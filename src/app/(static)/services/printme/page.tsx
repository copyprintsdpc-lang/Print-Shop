'use client'

import { useState } from 'react'
import QRCode from 'react-qr-code'
import Link from 'next/link'
import { Upload, Mail, Phone, Loader2, AlertCircle, CheckCircle, FileText, Image as ImageIcon, File, X } from 'lucide-react'

import CardArt from '@/components/illustrations/CardArt'
import HeroArt from '@/components/illustrations/HeroArt'
import FileUpload from '@/components/FileUpload'

const paperSizes = [
  'A4 (8.3" × 11.7")',
  'A3 (11.7" × 16.5")',
  'A2 (16.5" × 23.4")',
  'A1 (23.4" × 33.1")',
  'Business Card (3.5" × 2")',
  'Poster (18" × 24")',
  'Poster (24" × 36")',
  'Custom Size',
]

type UploadedFileState = any

export default function PrintMePage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileState[]>([])
  const [fileQuantities, setFileQuantities] = useState<Record<string, number>>({})
  const [fileColorModes, setFileColorModes] = useState<Record<string, 'color' | 'grayscale'>>({})
  const [filePaperSizes, setFilePaperSizes] = useState<Record<string, string>>({})
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [pickupCode, setPickupCode] = useState<string | null>(null)
  const [qrData, setQrData] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const hasUploadingFiles = uploadedFiles.some((file: any) => file.uploading)

  const handleFilesChange = (files: UploadedFileState[]) => {
    setUploadedFiles(files)
    const newQuantities = { ...fileQuantities }
    const newColorModes = { ...fileColorModes }
    const newPaperSizes = { ...filePaperSizes }

    files.forEach((file: any) => {
      const fileId = file.id || file.key || file.url || file.file?.name || Math.random().toString()
      if (!newQuantities[fileId]) {
        newQuantities[fileId] = 1
      }
      if (!newColorModes[fileId]) {
        newColorModes[fileId] = 'color'
      }
      if (!newPaperSizes[fileId]) {
        newPaperSizes[fileId] = 'A4 (8.3" × 11.7")'
      }
    })

    setFileQuantities(newQuantities)
    setFileColorModes(newColorModes)
    setFilePaperSizes(newPaperSizes)
  }

  const handleQuantityChange = (fileId: string, quantity: number) => {
    setFileQuantities(prev => ({
      ...prev,
      [fileId]: Math.max(1, quantity),
    }))
  }

  const handleColorModeChange = (fileId: string, colorMode: 'color' | 'grayscale') => {
    setFileColorModes(prev => ({
      ...prev,
      [fileId]: colorMode,
    }))
  }

  const handlePaperSizeChange = (fileId: string, paperSize: string) => {
    setFilePaperSizes(prev => ({
      ...prev,
      [fileId]: paperSize,
    }))
  }

  const resetForm = () => {
    setUploadedFiles([])
    setFileQuantities({})
    setFileColorModes({})
    setFilePaperSizes({})
    setContactEmail('')
    setContactPhone('')
    setSubmitStatus('idle')
    setErrorMessage('')
    setPickupCode(null)
    setQrData(null)
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const uploaded = uploadedFiles.filter((file: any) => file.key)

    if (uploaded.length === 0) {
      setSubmitStatus('error')
      setErrorMessage('Please upload at least one file before submitting.')
      return
    }

    if (hasUploadingFiles) {
      setSubmitStatus('error')
      setErrorMessage('Please wait for all files to finish uploading before submitting.')
      return
    }

    if (!contactEmail && !contactPhone) {
      setSubmitStatus('error')
      setErrorMessage('Please provide either an email address or phone number.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const filesPayload = uploaded.map((file: any, index: number) => {
        const fileId = file.id || file.key || file.url || file.file?.name || index.toString()
        return {
          key: file.key,
          url: file.url || undefined,
          name: file.file?.name || file.name || 'Document',
          size: file.file?.size || file.size || undefined,
          colorMode: fileColorModes[fileId] || 'color',
          paperSize: filePaperSizes[fileId] || 'A4 (8.3" × 11.7")',
          copies: fileQuantities[fileId] || 1,
        }
      })

      const response = await fetch('/api/pickups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: {
            email: contactEmail?.trim() || undefined,
            phone: contactPhone?.trim() || undefined,
          },
          files: filesPayload,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Failed to create pickup request')
      }

      setPickupCode(result.pickupCode)
      setQrData(result.qrData || result.pickupCode)
      setSubmitStatus('success')
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Pickup request error:', error)
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">PrintMe Upload</h1>
              <p className="mt-3 text-gray-800">
                Upload your files online, receive a pickup code instantly, and show it at the store for fast printing.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                We’ll email or text your unique code—no USB drives or waiting required.
              </p>
            </div>
            <div className="h-44 md:h-48 lg:h-56 rounded-xl overflow-hidden bg-red-700">
              <HeroArt className="opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Upload area */}
      <section id="upload" className="bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-10">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Files</h2>
                <p className="text-sm text-gray-600">
                  Drag and drop files here or click to browse. Files upload automatically when selected.
                </p>
              </div>

              <FileUpload
                onFilesChange={handleFilesChange}
                maxFiles={10}
                maxSize={50}
                acceptedTypes={[
                  'image/jpeg',
                  'image/png',
                  'image/jpg',
                  'application/pdf',
                ]}
                autoUpload
                showUploadButton={false}
                uploadEndpoint="/api/artwork/upload"
                folder="pickup"
                showFileSummary={false}
              />

              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Configure Files ({uploadedFiles.filter((file: any) => file.key).length} ready)
                  </h3>

                  {uploadedFiles
                    .filter((file: any) => file.key)
                    .map((file: any, index: number) => {
                      const fileId = file.id || file.key || file.url || file.file?.name || index.toString()
                      const quantity = fileQuantities[fileId] || 1
                      const colorMode = fileColorModes[fileId] || 'color'
                      const paperSize = filePaperSizes[fileId] || 'A4 (8.3" × 11.7")'
                      const fileName = file.file?.name || file.name || 'Document'
                      const fileType = file.file?.type || file.type || ''

                      let icon = <File className="w-6 h-6 text-gray-500" />
                      if (fileType.includes('image/')) icon = <ImageIcon className="w-6 h-6 text-blue-500" />
                      if (fileType === 'application/pdf') icon = <FileText className="w-6 h-6 text-red-500" />

                      return (
                        <div key={fileId} className="border border-gray-200 rounded-2xl bg-gray-50/60 overflow-hidden">
                          <div className="px-4 py-4 md:px-6 md:py-5 bg-white flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {icon}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 break-words">{fileName}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {(file.file?.size || file.size)
                                    ? `${((file.file?.size || file.size) / 1024 / 1024).toFixed(2)} MB`
                                    : 'Ready to print'}
                                </p>
                              </div>
                            </div>
                            {file.uploaded && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                Uploaded
                              </span>
                            )}
                          </div>

                          <div className="px-4 py-4 md:px-6 md:py-5 bg-gray-50">
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
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-500">We’ll send your pickup code to this address.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-500">Optional: receive your code by SMS/WhatsApp.</p>
                </div>
              </div>

              {submitStatus === 'error' && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Submission failed</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || hasUploadingFiles}
                className={`w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-white text-sm font-semibold shadow-sm transition hover:bg-red-600 ${
                  isSubmitting || hasUploadingFiles ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating pickup code...
                  </>
                ) : hasUploadingFiles ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Waiting for uploads...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Send to Print Shop
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && pickupCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleSuccessModalClose} />
          <div className="relative w-full max-w-lg rounded-3xl border border-green-100 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={handleSuccessModalClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-green-900 hover:bg-green-50 transition-colors"
              aria-label="Close success dialog"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="px-6 md:px-8 py-6 bg-green-50/80">
              <div className="flex flex-col items-center text-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                  <CheckCircle className="w-7 h-7" />
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-green-900 mb-2">
                    Pickup Code Generated!
                  </h3>
                  <p className="text-sm text-green-800 max-w-md">
                    Show this code or QR at the store to retrieve your files. We sent a copy to the contact details you provided.
                  </p>
                </div>
                <div className="w-full max-w-xs bg-white border-2 border-green-400 rounded-2xl px-5 py-4">
                  <p className="text-xs text-gray-500">Your Pickup Code</p>
                  <p className="mt-1 text-2xl font-extrabold text-green-700 tracking-wide">
                    {pickupCode}
                  </p>
                </div>
                {qrData && (
                  <div className="bg-white p-4 rounded-2xl border border-green-100">
                    <QRCode value={qrData} size={180} />
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 md:px-8 py-4 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-600">
                Need help? Call <a href="tel:+918897379737" className="font-semibold text-green-700">+91 8897379737</a>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSuccessModalClose}
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
