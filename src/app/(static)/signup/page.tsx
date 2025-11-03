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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Colorful background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
      
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-8 shadow-2xl">
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
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                ✨ Join Us Today
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create your account</h1>
              <p className="mb-6 text-gray-700">
                {signupMethod === 'email' ? 'We\'ll send you a verification email.' : 'Create an account with your phone number.'} 
                Already have an account? <a href="/login" className="text-purple-600 font-semibold underline hover:text-purple-700">Log in</a>
              </p>
            </div>
            
            {/* Signup Method Toggle */}
            <div className="mb-6">
              <div className="flex bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setSignupMethod('email')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                    signupMethod === 'email'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupMethod('phone')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                    signupMethod === 'phone'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </button>
              </div>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">First name</label>
                  <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)}
                    className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                    placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Last name</label>
                  <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)}
                    className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                    placeholder="Doe" />
                </div>
              </div>
              {signupMethod === 'email' ? (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                    className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                    placeholder="Enter your email address" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Number</label>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required
                    placeholder="+91 9876543210"
                    className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" />
                  <p className="text-xs mt-2 text-gray-600">
                    You can use this phone number to login later
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                  className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                  placeholder="Create a strong password" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required
                  className="w-full rounded-lg bg-white border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                  placeholder="Confirm your password" />
              </div>
              <button disabled={status==='loading'} className="w-full rounded-lg px-4 py-3 font-semibold text-lg disabled:opacity-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                {status==='loading' ? 'Creating...' : 'Sign up'}
              </button>
            </form>
          </>
        )}

        {/* Success Actions */}
        {status === 'success' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome to Sri Datta Print Center!
            </h2>
            <p className="mb-6 text-gray-700">
              Once you verify your email, you'll be able to browse our products and place orders.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/login')}
                className="w-full rounded-lg px-4 py-3 font-semibold text-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Go to Login</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full rounded-lg px-4 py-3 font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Create Another Account
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}


