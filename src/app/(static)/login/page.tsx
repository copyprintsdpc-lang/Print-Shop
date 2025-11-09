'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Phone, AlertCircle } from 'lucide-react'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading'); setMessage('')
    
    const loginData = loginMethod === 'email' 
      ? { email, password, loginMethod }
      : { phone, password, loginMethod }
    
    const res = await fetch('/api/auth/login', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(loginData) 
    })
    
    const data = await res.json().catch(()=>({}))
    if (!res.ok) {
      setStatus('error')
      if (data?.code === 'not_verified') {
        setMessage('Please verify your email.')
      } else if (data?.code === 'user_exists' || data?.code === 'phone_exists') {
        setMessage(data.message)
      } else {
        setMessage('Invalid credentials.')
      }
      return
    }
    
    // Redirect to original destination or dashboard
    const redirect = searchParams?.get('redirect') || '/dashboard'
    router.push(redirect)
  }

  async function resend() {
    setMessage('Sending...')
    await fetch('/api/auth/resend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    setMessage('If your email exists and is unverified, a new link was sent.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Colorful background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
      
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
              🔐 Welcome Back
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Log in</h1>
            <p className="mb-6 text-gray-700">No account? <a href="/signup" className="text-purple-600 font-semibold underline hover:text-purple-700">Sign up</a></p>
          </div>
        
          {/* Login Method Toggle */}
          <div className="mb-6">
            <div className="flex bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  loginMethod === 'email'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  loginMethod === 'phone'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </button>
            </div>
          </div>

        {/* Error Banner */}
        {status === 'error' && message && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-300">{message}</p>
                {message.includes('verify') && (
                  <button onClick={resend} className="text-xs text-red-400 underline mt-1">
                    Resend verification email
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

          <form onSubmit={onSubmit} className="space-y-5">
            {loginMethod === 'email' ? (
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  required 
                  className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                  placeholder="Enter your email"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e=>setPhone(e.target.value)} 
                  required 
                  className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                  placeholder="+91 9876543210"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required 
                className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                placeholder="Enter your password"
              />
            </div>
            
            <button 
              disabled={status==='loading'} 
              className="w-full rounded-lg px-4 py-3 font-semibold text-lg disabled:opacity-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {status==='loading' ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}

