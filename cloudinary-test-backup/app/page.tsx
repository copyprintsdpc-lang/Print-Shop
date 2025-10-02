'use client'

import { useState } from 'react'

export default function Home() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: any) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        const data = await response.json()
        
        if (data.ok) {
          console.log('Upload successful:', data.url)
          alert(`File uploaded successfully! URL: ${data.url}`)
        } else {
          console.error('Upload failed:', data.message)
          alert(`Upload failed: ${data.message}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Upload error occurred')
      }
    }
    
    setUploading(false)
    setFiles([])
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '1rem', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
        padding: '2rem', 
        maxWidth: '28rem', 
        width: '100%' 
      }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          color: '#1f2937', 
          marginBottom: '2rem' 
        }}>
          🚀 Cloudinary Test
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Select Files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'block', width: '100%', fontSize: '0.875rem', color: '#6b7280' }}
            />
          </div>
          
          {files.length > 0 && (
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem' }}>
              <h3 style={{ fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Selected Files:</h3>
              <ul style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                {files.map((file: any, index: number) => (
                  <li key={index}>• {file.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            style={{
              width: '100%',
              backgroundColor: files.length === 0 || uploading ? '#d1d5db' : '#2563eb',
              color: 'white',
              fontWeight: '500',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: files.length === 0 || uploading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
          </button>
          
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            <p>✅ Cloudinary configured and ready!</p>
            <p>Check console for upload URLs</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Running on port 3001</p>
          </div>
        </div>
      </div>
    </div>
  )
}