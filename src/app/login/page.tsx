'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading'); setMessage('')
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json().catch(()=>({}))
    if (!res.ok) {
      setStatus('error')
      if (data?.code === 'not_verified') setMessage('Please verify your email.'); else setMessage('Invalid email or password.')
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
        <p className="mb-4 text-sm" style={{ color: '#e5e7eb' }}>No account? <a href="/signup" className="underline">Sign up</a></p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: '#e5e7eb' }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full rounded-md bg-transparent border border-white/30 px-3 py-2 text-white placeholder-white/60 outline-none" />
          </div>
          <button disabled={status==='loading'} className="w-full rounded-md px-3 py-2 font-medium" style={{ background:'#F16E02', color:'#fff' }}>{status==='loading' ? 'Signing in...' : 'Login'}</button>
        </form>
        {message && <div className="mt-4 text-sm" style={{ color: '#e5e7eb' }}>{message} {message.includes('verify') && <button onClick={resend} className="underline ml-2">Resend link</button>}</div>}
      </div>
    </div>
  )
}
