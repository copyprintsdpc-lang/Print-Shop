'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, FileText, Image, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

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

interface FileUploadAreaProps {
  onFilesChange: (files: UploadedFile[]) => void
  onUploadStart: () => void
  onUploadEnd: () => void
}

export default function FileUploadArea({ onFilesChange, onUploadStart, onUploadEnd }: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/zip'
  ]

  const maxFileSize = 50 * 1024 * 1024 // 50MB
  const maxFiles = 10

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size exceeds 50MB limit`
    }
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported`
    }
    return null
  }

  const generateFileId = () => Math.random().toString(36).substring(2, 15)

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const fileId = generateFileId()
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.ok) {
        return {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: data.url,
          publicId: data.publicId,
          status: 'success',
          progress: 100
        }
      } else {
        throw new Error(data.message || 'Upload failed')
      }
    } catch (error) {
      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: '',
        publicId: '',
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  const handleFiles = useCallback(async (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []

    newFiles.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (validFiles.length === 0) return

    onUploadStart()

    // Add files with uploading status
    const initialFiles: UploadedFile[] = validFiles.map(file => ({
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      publicId: '',
      status: 'uploading',
      progress: 0
    }))

    const updatedFiles = [...files, ...initialFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)

    // Upload files
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      const fileIndex = updatedFiles.findIndex(f => f.name === file.name && f.status === 'uploading')

      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map((f, idx) => 
          idx === fileIndex ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
        ))
      }, 200)

      const result = await uploadFile(file)
      clearInterval(progressInterval)

      setFiles(prev => prev.map((f, idx) => 
        idx === fileIndex ? result : f
      ))
    }

    onUploadEnd()
    onFilesChange(files)
  }, [files, onFilesChange, onUploadStart, onUploadEnd])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />
    }
    return <FileText className="w-6 h-6 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`upload-area relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer ${
          isDragOver ? 'drag-over' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>
            <p className="text-sm text-gray-400">
              Supports: Images (JPEG, PNG, WebP, GIF), PDF, ZIP
            </p>
            <p className="text-sm text-gray-400">
              Max size: 50MB • Max files: {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Files ({files.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {file.status === 'uploading' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="progress-bar bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                    </div>
                  )}
                  
                  {file.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFiles(files.filter((_, i) => i !== index))
                      onFilesChange(files.filter((_, i) => i !== index))
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
