'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Image as ImageIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/cloudinary'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  publicId: string
  status: 'uploading' | 'success' | 'error'
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  folder?: string
  className?: string
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  folder = 'customer-uploads',
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      return file.type.match(type.replace('*', '.*'))
    })

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
    }

    return null
  }

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const fileId = Math.random().toString(36).substr(2, 9)
    
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      publicId: '',
      status: 'uploading'
    }

    try {
      const response = await uploadToCloudinary(file, folder, ['artwork', 'customer-upload'])
      
      uploadedFile.url = response.secure_url
      uploadedFile.publicId = response.public_id
      uploadedFile.status = 'success'
    } catch (error) {
      console.error('Upload error:', error)
      uploadedFile.status = 'error'
    }

    return uploadedFile
  }

  const handleFiles = async (fileList: FileList) => {
    const newFiles: File[] = Array.from(fileList)
    
    // Check max files limit
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate files
    const validFiles: File[] = []
    for (const file of newFiles) {
      const error = validateFile(file)
      if (error) {
        alert(`${file.name}: ${error}`)
        continue
      }
      validFiles.push(file)
    }

    // Add files to state immediately with uploading status
    const uploadingFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      publicId: '',
      status: 'uploading'
    }))

    setFiles(prev => [...prev, ...uploadingFiles])
    onFilesChange([...files, ...uploadingFiles])

    // Upload files
    for (let i = 0; i < validFiles.length; i++) {
      const uploadedFile = await uploadFile(validFiles[i])
      
      setFiles(prev => prev.map(f => 
        f.id === uploadingFiles[i].id ? uploadedFile : f
      ))
      
      onFilesChange(prev => prev.map(f => 
        f.id === uploadingFiles[i].id ? uploadedFile : f
      ))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-white/20 hover:border-white/40'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-orange-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Upload Your Artwork
            </h3>
            <p className="text-white/70 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <button
              onClick={openFileDialog}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Choose Files
            </button>
          </div>
          
          <div className="text-sm text-white/60">
            <p>Accepted formats: {acceptedTypes.join(', ')}</p>
            <p>Max file size: {maxSize}MB | Max files: {maxFiles}</p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-lg font-semibold text-white">Uploaded Files</h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-4 bg-white/10 rounded-lg border border-white/20"
            >
              <div className="text-orange-400">
                {getFileIcon(file.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {file.status === 'uploading' && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                )}
                
                {file.status === 'success' && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Uploaded</span>
                  </div>
                )}
                
                {file.status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Failed</span>
                  </div>
                )}
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-white/60 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}