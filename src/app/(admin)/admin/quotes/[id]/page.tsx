'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  FileText,
  Download,
  CheckCircle,
  Eye,
  MessageSquare,
  Clock,
  Edit,
  Save,
  X,
  Loader2
} from 'lucide-react'

interface QuoteRequest {
  _id: string
  quoteNumber: string
  customer: {
    phone: string
    email?: string
    name?: string
  }
  delivery: {
    method: 'pickup' | 'delivery'
    address?: string
  }
  quantity: number
  files: Array<{
    key: string
    url?: string
    downloadUrl?: string | null
    quantity: number
    name: string
    colorMode: 'color' | 'grayscale'
    paperSize: string
  }>
  message?: string
  status: 'new' | 'reviewed' | 'replied' | 'completed'
  deliveryStatus?: 'pending' | 'completed'
  adminNotes?: string
  auditTrail?: Array<{
    action: string
    performedBy?: string
    timestamp: Date
    notes?: string
  }>
  createdAt: string
  updatedAt: string
}

export default function QuoteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const quoteId = params.id as string

  const [quote, setQuote] = useState<QuoteRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [status, setStatus] = useState<string>('')
  const [deliveryStatus, setDeliveryStatus] = useState<string>('')

  useEffect(() => {
    if (quoteId) {
      fetchQuote()
    }
  }, [quoteId])

  const fetchQuote = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/quotes/${quoteId}`)
      const data = await response.json()

      if (data.ok && data.quote) {
        setQuote(data.quote)
        setAdminNotes(data.quote.adminNotes || '')
        setStatus(data.quote.status || 'new')
        setDeliveryStatus(data.quote.deliveryStatus || 'pending')
      } else {
        console.error('Failed to fetch quote:', data.message)
        alert('Failed to load quote: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
      alert('Error loading quote')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!quote) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          performedBy: 'admin', // In real app, get from auth context
          notes: `Status changed to ${newStatus}`
        }),
      })

      const data = await response.json()

      if (data.ok) {
        setQuote(data.quote)
        setStatus(newStatus)
        alert(`Status updated to ${newStatus}`)
        // Refresh to get updated audit trail
        await fetchQuote()
      } else {
        alert('Failed to update status: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!quote) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminNotes: adminNotes,
        }),
      })

      const data = await response.json()

      if (data.ok) {
        setQuote(data.quote)
        setEditingNotes(false)
        alert('Notes saved successfully')
      } else {
        alert('Failed to save notes: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Error saving notes')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'replied':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) {
      return '🖼️'
    } else if (ext === 'pdf') {
      return '📄'
    } else if (['doc', 'docx'].includes(ext || '')) {
      return '📝'
    }
    return '📎'
  }

  const resolveDownloadUrl = (file: QuoteRequest['files'][number]) => {
    if (file.downloadUrl) {
      return file.downloadUrl
    }

    if (file.url?.startsWith('http')) {
      return file.url
    }

    if (file.url) {
      return `${process.env.NEXT_PUBLIC_APP_URL || ''}${file.url}`
    }

    return '#'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quote...</p>
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Quote not found</p>
          <button
            onClick={() => router.push('/admin/quotes')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Quotes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/quotes')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Quotes
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quote.quoteNumber}</h1>
              <p className="text-gray-600">Quote Request Details</p>
            </div>
            <span className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{quote.customer.phone}</p>
                  </div>
                </div>
                {quote.customer.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{quote.customer.email}</p>
                    </div>
                  </div>
                )}
                {quote.customer.name && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{quote.customer.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Files */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Files ({quote.files.length})</h2>
              <div className="space-y-3">
                {quote.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl">{getFileIcon(file.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Quantity: {file.quantity}</span>
                          <span className="capitalize">Color: {file.colorMode === 'color' ? 'Colour' : 'Black & White'}</span>
                          <span>Size: {file.paperSize}</span>
                        </div>
                      </div>
                    </div>
                    {(() => {
                      const downloadUrl = resolveDownloadUrl(file)
                      const isDisabled = !downloadUrl || downloadUrl === '#'

                      return (
                        <a
                          href={isDisabled ? undefined : downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            isDisabled
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          aria-disabled={isDisabled}
                        >
                          <Download className="w-4 h-4" />
                          {isDisabled ? 'Unavailable' : 'Download'}
                        </a>
                      )
                    })()}
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quote Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Quantity</span>
                  <span className="font-medium text-gray-900">{quote.quantity} copies</span>
                </div>
                <div className="py-2 border-b border-gray-200">
                  <span className="text-gray-600 block mb-2">Paper Sizes (per file)</span>
                  <div className="space-y-1">
                    {quote.files.map((file, idx) => (
                      <div key={idx} className="text-sm text-gray-900">
                        <span className="font-medium">{file.name}:</span> {file.paperSize}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Delivery Method</span>
                  <span className="font-medium text-gray-900 capitalize">{quote.delivery.method}</span>
                </div>
                {quote.delivery.address && (
                  <div className="py-2">
                    <span className="text-gray-600 block mb-1">Delivery Address</span>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-900">{quote.delivery.address}</p>
                    </div>
                  </div>
                )}
                {quote.message && (
                  <div className="py-2">
                    <span className="text-gray-600 block mb-1">Customer Message</span>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{quote.message}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Trail */}
            {quote.auditTrail && quote.auditTrail.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Trail</h2>
                <div className="space-y-3">
                  {quote.auditTrail.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{entry.action}</p>
                        <p className="text-sm text-gray-600">
                          {entry.performedBy && `By ${entry.performedBy} • `}
                          {formatDate(entry.timestamp.toString())}
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Status</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleStatusUpdate('reviewed')}
                  disabled={updating || status === 'reviewed'}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-300 rounded-lg hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="w-4 h-4" />
                  Mark as Reviewed
                </button>
                <button
                  onClick={() => handleStatusUpdate('replied')}
                  disabled={updating || status === 'replied'}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 border border-green-300 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-4 h-4" />
                  Mark as Replied
                </button>
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={updating || status === 'completed'}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Completed
                </button>
              </div>
              {updating && (
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Admin Notes</h2>
                {!editingNotes && (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="p-1 text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editingNotes ? (
                <div className="space-y-3">
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add internal notes about this quote..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNotes}
                      disabled={updating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingNotes(false)
                        setAdminNotes(quote.adminNotes || '')
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">
                  {quote.adminNotes ? (
                    <p className="whitespace-pre-wrap">{quote.adminNotes}</p>
                  ) : (
                    <p className="text-gray-400 italic">No notes added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">{formatDate(quote.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900">{formatDate(quote.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

