'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, Mail, Phone, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setStatus('error'); setMessage('Passwords do not match'); return
    }
    
    // Validate required fields based on signup method
    if (signupMethod === 'email' && !email) {
      setStatus('error'); setMessage('Email is required'); return
    }
    if (signupMethod === 'phone' && !phone) {
      setStatus('error'); setMessage('Phone number is required'); return
    }
    
    setStatus('loading'); setMessage('')
    
    const signupData = signupMethod === 'email' 
      ? { email, password, firstName, lastName }
      : { phone, password, firstName, lastName }
    
    const res = await fetch('/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    })
    const data = await res.json()
    if (!res.ok) { setStatus('error'); setMessage(data.message || 'Failed'); return }
    
    if (signupMethod === 'email') {
      setStatus('success'); setMessage('Account created successfully! Please check your email to verify your account.')
    } else {
      setStatus('success'); setMessage('Account created successfully! You can now login with your phone number.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        {/* Success Banner */}
        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-400 mb-1">
                  Account Created Successfully!
                </h3>
                <p className="text-sm text-green-300 mb-3">
                  {signupMethod === 'email' ? (
                    <>We've sent a verification email to <strong>{email}</strong>. Please check your inbox and click the verification link to activate your account.</>
                  ) : (
                    <>Your account with phone number <strong>{phone}</strong> has been created successfully. You can now login with your phone number and password.</>
                  )}
                </p>
                <div className="flex items-center text-xs text-green-300">
                  {signupMethod === 'email' ? (
                    <>
                      <Mail className="w-4 h-4 mr-1" />
                      Check your email now
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-1" />
                      Ready to login with phone
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-400 mb-1">
                  Signup Failed
                </h3>
                <p className="text-sm text-red-300">
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}

        {status !== 'success' && (
          <>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: '#e5e7eb' }}>Create your account</h1>
            <p className="mb-6" style={{ color: '#e5e7eb' }}>
              {signupMethod === 'email' ? 'We\'ll send you a verification email.' : 'Create an account with your phone number.'} 
              Already have an account? <a href="/login" className="underline">Log in</a>
            </p>
            
            {/* Signup Method Toggle */}
            <div className="mb-6">
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setSignupMethod('email')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    signupMethod === 'email'
                      ? 'bg-white text-gray-900'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupMethod('phone')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    signupMethod === 'phone'
                      ? 'bg-white text-gray-900'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </button>
              </div>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>First name</label>
                  <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)}
                    className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Last name</label>
                  <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)}
                    className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" />
                </div>
              </div>
              {signupMethod === 'email' ? (
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Email</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                    className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" 
                    placeholder="Enter your email address" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required
                    placeholder="+91 9876543210"
                    className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" />
                  <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                    You can use this phone number to login later
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                  className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required
                  className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" />
              </div>
              <button disabled={status==='loading'} className="w-full rounded-md px-3 py-2 font-medium disabled:opacity-50" style={{ background:'#F16E02', color:'#fff' }}>
                {status==='loading' ? 'Creating...' : 'Sign up'}
              </button>
            </form>
          </>
        )}

        {/* Success Actions */}
        {status === 'success' && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#e5e7eb' }}>
              Welcome to Sri Datta Print Center!
            </h2>
            <p className="mb-6" style={{ color: '#e5e7eb' }}>
              Once you verify your email, you'll be able to browse our products and place orders.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/login')}
                className="w-full rounded-md px-4 py-2 font-medium flex items-center justify-center space-x-2"
                style={{ background:'#F16E02', color:'#fff' }}
              >
                <span>Go to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full rounded-md px-4 py-2 font-medium border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                Create Another Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


