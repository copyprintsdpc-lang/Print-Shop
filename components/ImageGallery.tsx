'use client'

import { useState } from 'react'
import { X, Download, ExternalLink, Eye, EyeOff } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  publicId: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

interface ImageGalleryProps {
  files: UploadedFile[]
  onRemoveFile: (id: string) => void
}

export default function ImageGallery({ files, onRemoveFile }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showUrls, setShowUrls] = useState(false)

  const successfulFiles = files.filter(file => file.status === 'success')

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return '🖼️'
    } else if (type === 'application/pdf') {
      return '📄'
    } else if (type.includes('zip')) {
      return '📦'
    }
    return '📁'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (successfulFiles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No files uploaded yet. Upload some files to see them here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowUrls(!showUrls)}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {showUrls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm">{showUrls ? 'Hide URLs' : 'Show URLs'}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {successfulFiles.map((file) => (
          <div key={file.id} className="image-card bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image Preview */}
            <div className="aspect-square bg-gray-100 relative group">
              {file.type.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(file.url)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl">{getFileIcon(file.type)}</div>
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="View in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = file.url
                      link.download = file.name
                      link.click()
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFile(file.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* File Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate mb-1">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {formatFileSize(file.size)}
              </p>
              
              {showUrls && (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Public ID:</label>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {file.publicId}
                      </code>
                      <button
                        onClick={() => copyToClipboard(file.publicId)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">URL:</label>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {file.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
