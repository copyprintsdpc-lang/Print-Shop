'use client'

import { Cloud, Upload, CheckCircle, AlertCircle, FileText, Image } from 'lucide-react'

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

interface UploadStatsProps {
  files: UploadedFile[]
  isUploading: boolean
}

export default function UploadStats({ files, isUploading }: UploadStatsProps) {
  const totalFiles = files.length
  const successfulFiles = files.filter(f => f.status === 'success')
  const failedFiles = files.filter(f => f.status === 'error')
  const uploadingFiles = files.filter(f => f.status === 'uploading')
  
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const successfulSize = successfulFiles.reduce((sum, file) => sum + file.size, 0)
  
  const imageFiles = files.filter(f => f.type.startsWith('image/'))
  const documentFiles = files.filter(f => f.type === 'application/pdf')
  const otherFiles = files.filter(f => !f.type.startsWith('image/') && f.type !== 'application/pdf')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getSuccessRate = () => {
    if (totalFiles === 0) return 0
    return Math.round((successfulFiles.length / totalFiles) * 100)
  }

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <Cloud className="w-6 h-6 text-primary-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-800">
          Upload Statistics
        </h3>
      </div>

      <div className="space-y-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Files</span>
              <FileText className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{totalFiles}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Success Rate</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{getSuccessRate()}%</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-gray-600">Successful</span>
            </div>
            <span className="font-medium text-green-600">{successfulFiles.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-gray-600">Failed</span>
            </div>
            <span className="font-medium text-red-600">{failedFiles.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Upload className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-gray-600">Uploading</span>
            </div>
            <span className="font-medium text-blue-600">{uploadingFiles.length}</span>
          </div>
        </div>

        {/* File Types */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">File Types</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Image className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-gray-600">Images</span>
              </div>
              <span className="font-medium">{imageFiles.length}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-gray-600">Documents</span>
              </div>
              <span className="font-medium">{documentFiles.length}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-600">Other</span>
              </div>
              <span className="font-medium">{otherFiles.length}</span>
            </div>
          </div>
        </div>

        {/* Size Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Storage Used</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Size</span>
              <span className="font-medium">{formatFileSize(totalSize)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uploaded</span>
              <span className="font-medium text-green-600">{formatFileSize(successfulSize)}</span>
            </div>
          </div>
        </div>

        {/* Cloudinary Status */}
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-primary-800">Cloudinary Status</h4>
              <p className="text-xs text-primary-600">Connected & Ready</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
