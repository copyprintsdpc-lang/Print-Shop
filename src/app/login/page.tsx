'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
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
    router.push('/dashboard')
  }

  async function resend() {
    setMessage('Sending...')
    await fetch('/api/auth/resend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    setMessage('If your email exists and is unverified, a new link was sent.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#e5e7eb' }}>Log in</h1>
        <p className="mb-6 text-sm" style={{ color: '#e5e7eb' }}>No account? <a href="/signup" className="underline">Sign up</a></p>
        
        {/* Login Method Toggle */}
        <div className="mb-6">
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'phone'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white/10'
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

        <form onSubmit={onSubmit} className="space-y-4">
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                required 
                className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" 
                placeholder="Enter your email"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={e=>setPhone(e.target.value)} 
                required 
                className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" 
                placeholder="+91 9876543210"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
              className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" 
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            disabled={status==='loading'} 
            className="w-full rounded-md px-3 py-2 font-medium disabled:opacity-50" 
            style={{ background:'#F16E02', color:'#fff' }}
          >
            {status==='loading' ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
