'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react'

interface FileUploadProps {
  onFilesChange: (files: any[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  uploadEndpoint?: string
  showUploadButton?: boolean
  autoUpload?: boolean
  folder?: string
}

interface FileWithStatus {
  file: File
  preview?: string
  uploading: boolean
  uploaded: boolean
  error: string | null
  url?: string
  publicId?: string
  progress: number
}

export default function FileUpload({ 
  onFilesChange, 
  maxFiles = 5, 
  maxSize = 50, // Increased to 50MB for artwork files
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  uploadEndpoint = '/api/artwork/upload',
  showUploadButton = true,
  autoUpload = false,
  folder = 'sdpc-print-media'
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(rejection => {
        console.error('File rejected:', rejection.errors)
      })
    }

    const newFiles: FileWithStatus[] = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploading: false,
      uploaded: false,
      error: null,
      progress: 0
    }))
    
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)

    // Auto upload if enabled
    if (autoUpload && newFiles.length > 0) {
      uploadFiles(newFiles)
    }
  }, [files, onFilesChange, autoUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - files.length,
    maxSize: maxSize * 1024 * 1024,
    disabled: files.length >= maxFiles || uploading
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  const uploadFiles = async (filesToUpload?: FileWithStatus[]) => {
    const filesToProcess = filesToUpload || files.filter(f => !f.uploaded && !f.uploading)
    
    if (filesToProcess.length === 0) return

    setUploading(true)

    for (let i = 0; i < filesToProcess.length; i++) {
      const fileObj = filesToProcess[i]
      const fileIndex = files.findIndex(f => f.file === fileObj.file)
      
      // Mark as uploading
      setFiles(prev => prev.map((f, idx) => 
        idx === fileIndex ? { ...f, uploading: true, progress: 0 } : f
      ))

      try {
        const formData = new FormData()
        formData.append('file', fileObj.file)
        formData.append('folder', folder)
        formData.append('type', 'artwork') // or 'product' for product images

        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
          ))
        }, 200)

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)

        const data = await response.json()

        if (data.ok) {
          // Mark as uploaded with URL
          setFiles(prev => prev.map((f, idx) => 
            idx === fileIndex ? { 
              ...f, 
              uploaded: true, 
              uploading: false, 
              progress: 100,
              url: data.url,
              publicId: data.publicId
            } : f
          ))
        } else {
          throw new Error(data.message || 'Upload failed')
        }
      } catch (error) {
        console.error('Upload error:', error)
        setFiles(prev => prev.map((f, idx) => 
          idx === fileIndex ? { 
            ...f, 
            uploading: false, 
            error: error instanceof Error ? error.message : 'Upload failed',
            progress: 0
          } : f
        ))
      }
    }

    setUploading(false)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6 text-blue-600" />
    if (file.type === 'application/pdf') return <FileText className="w-6 h-6 text-red-600" />
    if (file.type.includes('zip')) return <File className="w-6 h-6 text-purple-600" />
    if (file.type.includes('word') || file.type.includes('document')) return <FileText className="w-6 h-6 text-blue-600" />
    return <File className="w-6 h-6 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAcceptedTypesString = () => {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'JPEG',
      'image/png': 'PNG',
      'image/jpg': 'JPG',
      'application/pdf': 'PDF',
      'application/zip': 'ZIP',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
    }
    
    return acceptedTypes.map(type => typeMap[type] || type).join(', ')
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragReject
            ? 'border-red-400 bg-red-50'
            : isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
        } ${files.length >= maxFiles || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${
          isDragReject ? 'text-red-400' : 'text-gray-400'
        }`} />
        <p className={`text-lg font-medium mb-2 ${
          isDragReject ? 'text-red-600' : 'text-gray-900'
        }`}>
          {isDragReject 
            ? 'File type not supported' 
            : isDragActive 
              ? 'Drop files here' 
              : 'Upload your files'
          }
        </p>
        <p className="text-gray-500 mb-4">
          {isDragReject 
            ? 'Please select supported file types'
            : 'Drag and drop files here, or click to select files'
          }
        </p>
        <div className="text-sm text-gray-400 space-y-1">
          <p><strong>Accepted formats:</strong> {getAcceptedTypesString()}</p>
          <p><strong>Max size:</strong> {maxSize}MB per file • <strong>Max files:</strong> {maxFiles}</p>
          <p className="text-green-600 font-medium">
            ✅ File upload powered by Cloudinary - Ready to use!
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            Files ({files.length})
            {files.some(f => f.uploaded) && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {files.filter(f => f.uploaded).length} uploaded
              </span>
            )}
          </h3>
          
          <div className="space-y-2">
            {files.map((fileObj, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                fileObj.error ? 'bg-red-50 border-red-200' :
                fileObj.uploaded ? 'bg-green-50 border-green-200' :
                fileObj.uploading ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 flex-1">
                  {fileObj.preview ? (
                    <img 
                      src={fileObj.preview} 
                      alt={fileObj.file.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {getFileIcon(fileObj.file)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileObj.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(fileObj.file.size)}
                    </p>
                    
                    {fileObj.uploading && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          Uploading... {fileObj.progress}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                            style={{ width: `${fileObj.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {fileObj.uploaded && (
                      <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                        <CheckCircle className="w-4 h-4" />
                        Uploaded successfully
                      </div>
                    )}
                    
                    {fileObj.error && (
                      <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                        <AlertCircle className="w-4 h-4" />
                        {fileObj.error}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {fileObj.uploaded && fileObj.url && (
                    <button
                      onClick={() => window.open(fileObj.url, '_blank')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="View file"
                    >
                      View
                    </button>
                  )}
                  
                  {!fileObj.uploading && !fileObj.uploaded && (
                    <button
                      onClick={() => uploadFiles([fileObj])}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Upload file"
                    >
                      Upload
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={fileObj.uploading}
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {showUploadButton && files.length > 0 && files.some(f => !f.uploaded && !f.uploading) && (
        <div className="mt-6">
          <button
            onClick={() => uploadFiles()}
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading Files...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload All Files
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-500 text-center mt-2">
            {files.filter(f => !f.uploaded && !f.uploading).length} files pending upload
          </p>
        </div>
      )}
    </div>
  )
}