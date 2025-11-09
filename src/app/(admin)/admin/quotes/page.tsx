'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Phone, 
  Mail, 
  Calendar, 
  Filter,
  Search,
  Eye,
  CheckCircle,
  MessageSquare,
  Clock,
  Download,
  ChevronRight
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
    paperSize?: string
  }>
  message?: string
  status: 'new' | 'reviewed' | 'replied' | 'completed'
  deliveryStatus?: 'pending' | 'completed'
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminQuotesPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchQuotes()
  }, [filterStatus])

  const fetchQuotes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }
      
      const response = await fetch(`/api/admin/quotes?${params.toString()}`)
      const data = await response.json()
      
      if (data.ok) {
        setQuotes(data.quotes || [])
      } else {
        console.error('Failed to fetch quotes:', data.message)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800'
      case 'replied':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4" />
      case 'reviewed':
        return <Eye className="w-4 h-4" />
      case 'replied':
        return <MessageSquare className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        quote.quoteNumber.toLowerCase().includes(searchLower) ||
        quote.customer.phone.includes(searchTerm) ||
        quote.customer.email?.toLowerCase().includes(searchLower) ||
        quote.customer.name?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

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

  const summarizePaperSize = (quote: QuoteRequest) => {
    if (!quote.files || quote.files.length === 0) return 'Not specified'
    const uniqueSizes = Array.from(
      new Set(
        quote.files
          .map((file) => file.paperSize?.trim())
          .filter((size): size is string => Boolean(size))
      )
    )

    if (uniqueSizes.length === 0) return 'Not specified'
    if (uniqueSizes.length === 1) return uniqueSizes[0]
    return `${uniqueSizes.length} sizes`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quotes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Requests</h1>
          <p className="text-gray-600">Manage and respond to customer quote requests</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by quote number, phone, email, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="replied">Replied</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quotes List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredQuotes.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No quotes found</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm ? 'Try adjusting your search or filters' : 'Quote requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote._id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/quotes/${quote._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{quote.quoteNumber}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(quote.status)}`}>
                          {getStatusIcon(quote.status)}
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        {/* Customer Info */}
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900">{quote.customer.phone}</p>
                          </div>
                        </div>

                        {quote.customer.email && (
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-sm font-medium text-gray-900 truncate">{quote.customer.email}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Files</p>
                            <p className="text-sm font-medium text-gray-900">
                              {quote.files.length} file{quote.files.length !== 1 ? 's' : ''} ({quote.quantity} copies)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Submitted</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(quote.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          <strong>Sizes:</strong> {summarizePaperSize(quote)}
                        </span>
                        <span>
                          <strong>Delivery:</strong> {quote.delivery.method === 'delivery' ? 'Delivery' : 'Pickup'}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">New</p>
            <p className="text-2xl font-bold text-blue-900">
              {quotes.filter(q => q.status === 'new').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-600 font-medium">Reviewed</p>
            <p className="text-2xl font-bold text-yellow-900">
              {quotes.filter(q => q.status === 'reviewed').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-medium">Replied</p>
            <p className="text-2xl font-bold text-green-900">
              {quotes.filter(q => q.status === 'replied').length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

