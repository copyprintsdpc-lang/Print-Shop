import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/auth'
import { Clock, FileText, Bookmark, User as UserIcon, ArrowRight, LogOut } from 'lucide-react'

type JobItem = {
  id: string
  name: string
  submittedAt: string
  status: 'Queued' | 'Processing' | 'Ready' | 'Completed'
}

function mockJobs(): { current: JobItem[]; past: JobItem[] } {
  return {
    current: [
      { id: 'J-2481', name: 'Project Proposal.pdf', submittedAt: 'Today, 10:12 AM', status: 'Processing' },
      { id: 'J-2479', name: 'Invoice_Sept.xlsx', submittedAt: 'Yesterday, 5:41 PM', status: 'Queued' },
    ],
    past: [
      { id: 'J-2440', name: 'Poster_A2_final.ai', submittedAt: 'Sep 02, 3:10 PM', status: 'Completed' },
    ],
  }
}

export default async function DashboardPage() {
  const token = cookies().get('sdp_session')?.value
  const payload = token ? verifyJwt(token) : null
  if (!payload) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
          <div className="text-lg" style={{ color: '#e5e7eb' }}>Please log in</div>
        </div>
      </div>
    )
  }

  const jobs = mockJobs()

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#e5e7eb' }}>My Account</h1>
            <p className="mt-1" style={{ color: '#e5e7eb' }}>Welcome, {payload.email}</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 border border-white/20 bg-white/10 hover:bg-white/15 transition-colors" style={{ color:'#e5e7eb' }}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </form>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Order History */}
          <a href="#order-history" className="group block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" style={{ color: '#e5e7eb' }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold" style={{ color: '#e5e7eb' }}>Order History</div>
                <div className="text-sm" style={{ color: '#e5e7eb' }}>Track, reorder, or rename files</div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-0.5 transition-transform" style={{ color: '#e5e7eb' }} />
            </div>
          </a>

          {/* My Documents */}
          <a href="#documents" className="group block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" style={{ color: '#e5e7eb' }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold" style={{ color: '#e5e7eb' }}>My Documents</div>
                <div className="text-sm" style={{ color: '#e5e7eb' }}>Manage uploads and saved files</div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-0.5 transition-transform" style={{ color: '#e5e7eb' }} />
            </div>
          </a>

          {/* Saved Jobs */}
          <a href="#saved" className="group block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6" style={{ color: '#e5e7eb' }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold" style={{ color: '#e5e7eb' }}>Saved Jobs</div>
                <div className="text-sm" style={{ color: '#e5e7eb' }}>Quickly reopen recent work</div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-0.5 transition-transform" style={{ color: '#e5e7eb' }} />
            </div>
          </a>

          {/* My Account */}
          <a href="#account" className="group block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <UserIcon className="w-6 h-6" style={{ color: '#e5e7eb' }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold" style={{ color: '#e5e7eb' }}>My Account</div>
                <div className="text-sm" style={{ color: '#e5e7eb' }}>Profile and security</div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-0.5 transition-transform" style={{ color: '#e5e7eb' }} />
            </div>
          </a>
        </div>

        {/* Order history */}
        <section id="order-history" className="mb-10 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10" style={{ color: '#e5e7eb' }}>Order History</div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold mb-3" style={{ color: '#e5e7eb' }}>Current Jobs</div>
                <div className="space-y-3">
                  {jobs.current.map(job => (
                    <div key={job.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                      <div>
                        <div className="font-medium" style={{ color: '#e5e7eb' }}>{job.name}</div>
                        <div className="text-xs opacity-80" style={{ color: '#e5e7eb' }}>{job.id} • {job.submittedAt} • {job.status}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded-md border border-white/20 text-sm" style={{ color:'#e5e7eb' }}>Re-order</button>
                        <button className="px-3 py-1 rounded-md border border-white/20 text-sm" style={{ color:'#e5e7eb' }}>Cancel</button>
                        <button className="px-3 py-1 rounded-md border border-white/20 text-sm" style={{ color:'#e5e7eb' }}>View</button>
                        <button className="px-3 py-1 rounded-md border border-white/20 text-sm" style={{ color:'#e5e7eb' }}>Rename File</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-3" style={{ color: '#e5e7eb' }}>Past Jobs</div>
                <div className="space-y-3">
                  {jobs.past.map(job => (
                    <div key={job.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                      <div>
                        <div className="font-medium" style={{ color: '#e5e7eb' }}>{job.name}</div>
                        <div className="text-xs opacity-80" style={{ color: '#e5e7eb' }}>{job.id} • {job.submittedAt} • {job.status}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded-md border border-white/20 text-sm" style={{ color:'#e5e7eb' }}>Re-order</button>
                        <button className="px-3 py-1 rounded-md border border-white/20 text-sm" style={{ color:'#e5e7eb' }}>View</button>
                        <button className="px-3 py-1 rounded-md border border-white/20 text-sm" style={{ color:'#e5e7eb' }}>Rename File</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documents + Saved (placeholders) */}
        <section id="documents" className="mb-10 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
          <div className="font-semibold mb-2" style={{ color: '#e5e7eb' }}>My Documents</div>
          <p style={{ color: '#e5e7eb' }}>Upload, manage and reuse your frequently printed files. (Coming soon)</p>
        </section>

        <section id="saved" className="mb-10 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
          <div className="font-semibold mb-2" style={{ color: '#e5e7eb' }}>Saved Jobs</div>
          <p style={{ color: '#e5e7eb' }}>Quick access to jobs you bookmarked for later. (Coming soon)</p>
        </section>

        {/* Account */}
        <section id="account" className="mb-10 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
          <div className="font-semibold mb-4" style={{ color: '#e5e7eb' }}>Account</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm opacity-80" style={{ color: '#e5e7eb' }}>Name</div>
              <div className="font-medium" style={{ color: '#e5e7eb' }}>{payload.email.split('@')[0]}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm opacity-80" style={{ color: '#e5e7eb' }}>Email</div>
              <div className="font-medium" style={{ color: '#e5e7eb' }}>{payload.email}</div>
            </div>
          </div>
          <form action="/api/auth/logout" method="post" className="mt-6">
            <button className="rounded-md px-4 py-2" style={{ background:'#F16E02', color:'#fff' }}>Logout</button>
          </form>
        </section>
      </div>
    </div>
  )
}


