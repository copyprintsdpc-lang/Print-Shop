'use client'

import { useState } from 'react'
import { Loader2, Search, AlertCircle, Download, CheckCircle, PackageCheck, RefreshCcw } from 'lucide-react'

interface PickupFile {
  key: string
  name: string
  colorMode?: string
  paperSize?: string
  copies: number
  downloadUrl: string
}

interface PickupData {
  pickupCode: string
  customer: {
    phone?: string
    email?: string
  }
  status: 'new' | 'printed' | 'collected'
  files: PickupFile[]
  createdAt: string
  updatedAt: string
}

const statusStyles: Record<PickupData['status'], string> = {
  new: 'bg-blue-100 text-blue-700',
  printed: 'bg-amber-100 text-amber-700',
  collected: 'bg-green-100 text-green-700',
}

export default function AdminPickupsPage() {
  const [codeInput, setCodeInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pickup, setPickup] = useState<PickupData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!codeInput.trim()) {
      setError('Enter a pickup code to search.')
      setPickup(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setPickup(null)

      const response = await fetch(`/api/admin/pickups/${codeInput.trim()}`)
      const result = await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Pickup code not found.')
      }

      setPickup(result.pickup)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pickup request.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status: PickupData['status']) => {
    if (!pickup) return

    try {
      setUpdatingStatus(true)
      const response = await fetch(`/api/admin/pickups/${pickup.pickupCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Failed to update status.')
      }

      setPickup(result.pickup)
    } catch (err: any) {
      setError(err.message || 'Failed to update pickup status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold text-gray-900">Pickup Requests</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter a customer’s pickup code to retrieve files, download documents, and update status.
        </p>

        <form onSubmit={handleSearch} className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="sr-only" htmlFor="pickup-code">
              Pickup code
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="pickup-code"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter pickup code (e.g. PU-251108-ABC12)"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Lookup
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {pickup && (
          <div className="mt-8 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Pickup Code</p>
                <p className="text-2xl font-semibold text-gray-900">{pickup.pickupCode}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {pickup.customer.email && <span>Email: {pickup.customer.email}</span>}
                  {pickup.customer.phone && <span>Phone: {pickup.customer.phone}</span>}
                  <span>
                    Created: {new Date(pickup.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[pickup.status]}`}>
                  {pickup.status === 'new' && <RefreshCcw className="w-3 h-3" />}
                  {pickup.status === 'printed' && <PackageCheck className="w-3 h-3" />}
                  {pickup.status === 'collected' && <CheckCircle className="w-3 h-3" />}
                  {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Files ({pickup.files.length})</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {pickup.files.map((file, index) => (
                  <div key={file.key + index} className="border border-gray-200 rounded-xl bg-gray-50/70 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {file.colorMode === 'grayscale' ? 'Black & White' : 'Colour'} • {file.paperSize || 'A4'} • {file.copies} copy{file.copies === 1 ? '' : 'ies'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.open(file.downloadUrl, '_blank')}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-600">
                Update status once the order is printed or collected at the counter.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateStatus('printed')}
                  disabled={pickup.status === 'printed' || pickup.status === 'collected' || updatingStatus}
                  className="inline-flex items-center justify-center rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition disabled:opacity-50"
                >
                  Mark Printed
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus('collected')}
                  disabled={pickup.status === 'collected' || updatingStatus}
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-50"
                >
                  {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mark Collected'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

