'use client'

import { useState, useEffect } from 'react'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: any
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending', message: 'Testing...' },
    { name: 'Cloudinary Upload', status: 'pending', message: 'Testing...' },
    { name: 'API Routes', status: 'pending', message: 'Testing...' },
    { name: 'Environment Variables', status: 'pending', message: 'Testing...' }
  ])
  
  const [running, setRunning] = useState(false)

  const updateTest = (index: number, status: 'success' | 'error', message: string, details?: any) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, details } : test
    ))
  }

  const runTests = async () => {
    setRunning(true)
    
    // Test 1: Database Connection
    try {
      const dbResponse = await fetch('/api/test/db')
      const dbData = await dbResponse.json()
      
      if (dbData.success) {
        updateTest(0, 'success', 'Database connected successfully', dbData)
      } else {
        updateTest(0, 'error', `Database error: ${dbData.message}`, dbData)
      }
    } catch (error) {
      updateTest(0, 'error', `Database connection failed: ${error}`, error)
    }

    // Test 2: Cloudinary Upload
    try {
      // Create a simple test file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('folder', 'test-uploads')
      
      const cloudinaryResponse = await fetch('/api/artwork/upload', {
        method: 'POST',
        body: formData
      })
      
      const cloudinaryData = await cloudinaryResponse.json()
      
      if (cloudinaryData.success) {
        updateTest(1, 'success', 'Cloudinary upload working', cloudinaryData)
      } else {
        updateTest(1, 'error', `Cloudinary error: ${cloudinaryData.message}`, cloudinaryData)
      }
    } catch (error) {
      updateTest(1, 'error', `Cloudinary upload failed: ${error}`, error)
    }

    // Test 3: API Routes
    try {
      const apiTests = [
        { name: 'Products API', url: '/api/admin/products' },
        { name: 'Orders API', url: '/api/admin/orders' },
        { name: 'Promotions API', url: '/api/admin/promotions' }
      ]
      
      const apiResults = []
      for (const test of apiTests) {
        try {
          const response = await fetch(test.url)
          apiResults.push({
            name: test.name,
            status: response.ok ? 'success' : 'error',
            statusCode: response.status
          })
        } catch (error) {
          apiResults.push({
            name: test.name,
            status: 'error',
            error: error
          })
        }
      }
      
      const successCount = apiResults.filter(r => r.status === 'success').length
      updateTest(2, 'success', `${successCount}/${apiTests.length} API routes working`, apiResults)
    } catch (error) {
      updateTest(2, 'error', `API test failed: ${error}`, error)
    }

    // Test 4: Environment Variables
    try {
      const envTests = [
        'MONGODB_URI',
        'CLOUDINARY_URL',
        'CLOUDINARY_UPLOAD_PRESET',
        'JWT_SECRET'
      ]
      
      const envResults = envTests.map(env => ({
        name: env,
        present: !!process.env[env]
      }))
      
      const presentCount = envResults.filter(r => r.present).length
      updateTest(3, 'success', `${presentCount}/${envTests.length} environment variables set`, envResults)
    } catch (error) {
      updateTest(3, 'error', `Environment test failed: ${error}`, error)
    }

    setRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '⏳'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-yellow-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🧪 Print-Shop Application Test Suite
          </h1>
          
          <div className="mb-8">
            <button
              onClick={runTests}
              disabled={running}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {running ? 'Running Tests...' : '🚀 Run All Tests'}
            </button>
          </div>

          <div className="space-y-6">
            {tests.map((test, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getStatusIcon(test.status)} {test.name}
                  </h3>
                  <span className={`font-medium ${getStatusColor(test.status)}`}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{test.message}</p>
                
                {test.details && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                      Show Details
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Quick Navigation</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <a href="/admin" className="text-blue-600 hover:underline">Admin Dashboard</a>
              <a href="/admin/products" className="text-blue-600 hover:underline">Products</a>
              <a href="/admin/orders" className="text-blue-600 hover:underline">Orders</a>
              <a href="/admin/promotions" className="text-blue-600 hover:underline">Promotions</a>
              <a href="/checkout" className="text-blue-600 hover:underline">Checkout</a>
              <a href="/" className="text-blue-600 hover:underline">Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
