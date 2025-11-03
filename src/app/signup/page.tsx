'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setStatus('error'); setMessage('Passwords do not match'); return
    }
    setStatus('loading'); setMessage('')
    const res = await fetch('/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName })
    })
    const data = await res.json()
    if (!res.ok) { setStatus('error'); setMessage(data.message || 'Failed'); return }
    setStatus('success'); setMessage('Check your inbox to verify your email.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#e5e7eb' }}>Create your account</h1>
        <p className="mb-6" style={{ color: '#e5e7eb' }}>We’ll send you a verification email. Already have an account? <a href="/login" className="underline">Log in</a></p>
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
          <div>
            <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" />
          </div>
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
          <button disabled={status==='loading'} className="w-full rounded-md px-3 py-2 font-medium" style={{ background:'#F16E02', color:'#fff' }}>
            {status==='loading' ? 'Creating...' : 'Sign up'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm" style={{ color:'#e5e7eb' }}>{message}</p>}
      </div>
    </div>
  )
}


