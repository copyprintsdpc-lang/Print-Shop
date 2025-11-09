'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Save,
  Loader2,
  RefreshCcw,
  Pencil,
  X,
  Mail,
  Download,
  Settings2,
  ClipboardList,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

interface ServiceRecord {
  _id: string
  title: string
  slug: string
  description?: string
  priceRange?: string
  isActive: boolean
  updatedBy?: string
  updatedAt: string
  createdAt: string
}

interface QuoteFile {
  key: string
  name: string
  quantity: number
  colorMode: 'color' | 'grayscale'
  paperSize: string
  downloadUrl?: string | null
}

interface QuoteRecord {
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
  files: QuoteFile[]
  status: 'new' | 'reviewed' | 'replied' | 'completed'
  quotedAmount?: number
  quotedAt?: string
  createdAt: string
}

interface PickupFile {
  key: string
  name: string
  colorMode?: 'color' | 'grayscale'
  paperSize?: string
  copies: number
  downloadUrl?: string | null
}

interface PickupRecord {
  _id: string
  pickupCode: string
  customer: {
    phone?: string
    email?: string
  }
  status: 'new' | 'printed' | 'collected'
  files: PickupFile[]
  createdAt: string
}

type TabKey = 'services' | 'quotes' | 'uploads'

const tabs: Array<{ key: TabKey; label: string; icon: React.ComponentType<any> }> = [
  { key: 'services', label: 'Services', icon: Settings2 },
  { key: 'quotes', label: 'Quotes', icon: FileText },
  { key: 'uploads', label: 'Uploads', icon: ClipboardList },
]

export default function AdminOperationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('services')

  const [services, setServices] = useState<ServiceRecord[]>([])
  const [servicesLoading, setServicesLoading] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    priceRange: '',
    isActive: true,
  })
  const [serviceStatus, setServiceStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [quotes, setQuotes] = useState<QuoteRecord[]>([])
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [quoteStatus, setQuoteStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [quoteEmailModal, setQuoteEmailModal] = useState<{
    quoteId: string | null
    subject: string
    message: string
    quotedAmount: string
    additionalNotes: string
    sending: boolean
  }>({
    quoteId: null,
    subject: '',
    message: '',
    quotedAmount: '',
    additionalNotes: '',
    sending: false,
  })

  const [pickups, setPickups] = useState<PickupRecord[]>([])
  const [pickupsLoading, setPickupsLoading] = useState(false)
  const [pickupStatus, setPickupStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [pickupFilter, setPickupFilter] = useState<'all' | 'new' | 'printed' | 'collected'>('all')

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      description: '',
      priceRange: '',
      isActive: true,
    })
    setEditingServiceId(null)
  }

  const loadServices = async () => {
    setServicesLoading(true)
    setServiceStatus(null)
    try {
      const response = await fetch('/api/admin/services')
      const data = await response.json()
      if (data.ok) {
        setServices(data.services || [])
      } else {
        setServiceStatus({ type: 'error', message: data.message || 'Failed to load services' })
      }
    } catch (error) {
      console.error('Failed to load services', error)
      setServiceStatus({ type: 'error', message: 'Failed to load services' })
    } finally {
      setServicesLoading(false)
    }
  }

  const loadQuotes = async () => {
    setQuotesLoading(true)
    setQuoteStatus(null)
    try {
      const response = await fetch('/api/admin/quotes?status=all')
      const data = await response.json()
      if (data.ok) {
        setQuotes(data.quotes || [])
      } else {
        setQuoteStatus({ type: 'error', message: data.message || 'Failed to load quotes' })
      }
    } catch (error) {
      console.error('Failed to load quotes', error)
      setQuoteStatus({ type: 'error', message: 'Failed to load quotes' })
    } finally {
      setQuotesLoading(false)
    }
  }

  const loadPickups = useCallback(async (status: typeof pickupFilter) => {
    setPickupsLoading(true)
    setPickupStatus(null)
    try {
      const params = new URLSearchParams()
      if (status !== 'all') {
        params.append('status', status)
      }
      const response = await fetch(`/api/admin/pickups?${params.toString()}`)
      const data = await response.json()
      if (data.ok) {
        setPickups(data.pickups || [])
      } else {
        setPickupStatus({ type: 'error', message: data.message || 'Failed to load uploads' })
      }
    } catch (error) {
      console.error('Failed to load pickups', error)
      setPickupStatus({ type: 'error', message: 'Failed to load uploads' })
    } finally {
      setPickupsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadServices()
    loadQuotes()
    loadPickups('all')
  }, [loadPickups])

  useEffect(() => {
    loadPickups(pickupFilter)
  }, [pickupFilter, loadPickups])

  const handleServiceSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setServiceStatus(null)

    try {
      const payload = {
        title: serviceForm.title,
        description: serviceForm.description,
        priceRange: serviceForm.priceRange,
        isActive: serviceForm.isActive,
      }

      const response = editingServiceId
        ? await fetch(`/api/admin/services/${editingServiceId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      const data = await response.json()
      if (!data.ok) {
        setServiceStatus({ type: 'error', message: data.message || 'Failed to save service' })
        return
      }

      setServiceStatus({
        type: 'success',
        message: editingServiceId ? 'Service updated successfully' : 'Service created successfully',
      })
      resetServiceForm()
      loadServices()
    } catch (error) {
      console.error('Failed to save service', error)
      setServiceStatus({ type: 'error', message: 'Failed to save service' })
    }
  }

  const startEditingService = (service: ServiceRecord) => {
    setEditingServiceId(service._id)
    setServiceForm({
      title: service.title,
      description: service.description || '',
      priceRange: service.priceRange || '',
      isActive: service.isActive,
    })
  }

  const resetQuoteEmailModal = () =>
    setQuoteEmailModal({
      quoteId: null,
      subject: '',
      message: '',
      quotedAmount: '',
      additionalNotes: '',
      sending: false,
    })

  const handleQuoteEmailOpen = (quote: QuoteRecord) => {
    setQuoteStatus(null)
    setQuoteEmailModal({
      quoteId: quote._id,
      subject: `Quote for ${quote.quoteNumber}`,
      message: `Hi${quote.customer.name ? ` ${quote.customer.name}` : ''},\n\nPlease find the pricing details for your request ${quote.quoteNumber}.`,
      quotedAmount: quote.quotedAmount ? quote.quotedAmount.toString() : '',
      additionalNotes: '',
      sending: false,
    })
  }

  const handleSendQuoteEmail = async () => {
    if (!quoteEmailModal.quoteId) return

    setQuoteEmailModal((prev) => ({ ...prev, sending: true }))
    setQuoteStatus(null)

    try {
      const response = await fetch(`/api/admin/quotes/${quoteEmailModal.quoteId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: quoteEmailModal.subject,
          message: quoteEmailModal.message,
          quotedAmount: quoteEmailModal.quotedAmount,
          additionalNotes: quoteEmailModal.additionalNotes,
        }),
      })

      const data = await response.json()
      if (!data.ok) {
        setQuoteStatus({ type: 'error', message: data.message || 'Failed to email quote' })
      } else {
        setQuoteStatus({ type: 'success', message: 'Quote emailed to customer' })
        resetQuoteEmailModal()
        loadQuotes()
      }
    } catch (error) {
      console.error('Failed to email quote', error)
      setQuoteStatus({ type: 'error', message: 'Failed to email quote' })
    } finally {
      setQuoteEmailModal((prev) => ({ ...prev, sending: false }))
    }
  }

  const filteredQuotes = useMemo(() => quotes.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [quotes])

  const filteredPickups = useMemo(
    () => pickups.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [pickups]
  )

  const renderStatusBanner = (status: typeof serviceStatus | typeof quoteStatus | typeof pickupStatus) => {
    if (!status) return null
    const Icon = status.type === 'success' ? CheckCircle2 : AlertCircle
    const bg =
      status.type === 'success'
        ? 'bg-green-50 border-green-200 text-green-700'
        : 'bg-red-50 border-red-200 text-red-700'
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${bg}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{status.message}</span>
        <button
          type="button"
          className="ml-auto text-xs underline"
          onClick={() => {
            if (status === serviceStatus) setServiceStatus(null)
            if (status === quoteStatus) setQuoteStatus(null)
            if (status === pickupStatus) setPickupStatus(null)
          }}
        >
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Operations Console</h1>
            <p className="text-gray-600 mt-2">
              Manage services, respond to quote requests, and process customer file uploads from one place.
            </p>
          </div>
          <button
            onClick={() => {
              loadServices()
              loadQuotes()
              loadPickups(pickupFilter)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh All
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white shadow'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'services' && (
          <div className="space-y-6">
            {renderStatusBanner(serviceStatus)}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingServiceId ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Keep the services list up to date for marketing and quoting.
                  </p>
                </div>
                {editingServiceId && (
                  <button
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                    onClick={resetServiceForm}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Business Cards"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <input
                      type="text"
                      value={serviceForm.priceRange}
                      onChange={(e) => setServiceForm((prev) => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. ₹2 - ₹5 per card"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Short summary to show on the services page."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="service-active"
                    type="checkbox"
                    checked={serviceForm.isActive}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="service-active" className="text-sm text-gray-700">
                    Active – show this service on the website
                  </label>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetServiceForm}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Save className="w-4 h-4" />
                    {editingServiceId ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Service Catalog</h2>
                  <p className="text-sm text-gray-500">Review and edit the services available to customers.</p>
                </div>
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  onClick={loadServices}
                >
                  <RefreshCcw className={`w-4 h-4 ${servicesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price Range
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {servicesLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading services...
                          </div>
                        </td>
                      </tr>
                    ) : services.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No services found. Create one using the form above.
                        </td>
                      </tr>
                    ) : (
                      services.map((service) => (
                        <tr key={service._id}>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{service.title}</p>
                            {service.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700">{service.priceRange || '—'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                service.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {service.isActive ? 'Active' : 'Hidden'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm">
                            <button
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800"
                              onClick={() => startEditingService(service)}
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {renderStatusBanner(quoteStatus)}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Quote Requests</h2>
                  <p className="text-sm text-gray-500">
                    Review file uploads, prepare pricing, and email customers directly.
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  onClick={loadQuotes}
                >
                  <RefreshCcw className={`w-4 h-4 ${quotesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Files
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quotesLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading quotes...
                          </div>
                        </td>
                      </tr>
                    ) : filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No quotes available.
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map((quote) => (
                        <tr key={quote._id}>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{quote.quoteNumber}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(quote.createdAt).toLocaleString('en-IN')}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1 text-sm text-gray-700">
                              <p>{quote.customer.phone}</p>
                              {quote.customer.email && (
                                <p className="flex items-center gap-1 text-blue-600">
                                  <Mail className="w-3 h-3" />
                                  {quote.customer.email}
                                </p>
                              )}
                              {quote.customer.name && <p className="text-xs text-gray-500">{quote.customer.name}</p>}
                            </div>
                          </td>
                          <td className="px-6 py-4 space-y-2">
                            <p className="text-sm text-gray-700 font-medium">
                              {quote.files.length} file{quote.files.length !== 1 ? 's' : ''} • {quote.quantity} copies
                            </p>
                            <div className="space-y-1">
                              {quote.files.map((file, index) => (
                                <div key={file.key + index} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600 truncate pr-2">{file.name}</span>
                                  <a
                                    href={file.downloadUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                                      file.downloadUrl
                                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    <Download className="w-3 h-3" />
                                    Download
                                  </a>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  quote.status === 'replied'
                                    ? 'bg-green-100 text-green-800'
                                    : quote.status === 'reviewed'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : quote.status === 'completed'
                                    ? 'bg-gray-100 text-gray-600'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                              </span>
                              {quote.quotedAmount !== undefined && (
                                <span className="text-xs text-gray-500">
                                  Quoted ₹{quote.quotedAmount.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col gap-2 items-end">
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => handleQuoteEmailOpen(quote)}
                              >
                                <Mail className="w-4 h-4" />
                                Email Quote
                              </button>
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                                onClick={() => window.open(`/admin/quotes/${quote._id}`, '_blank')}
                              >
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {quoteEmailModal.quoteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetQuoteEmailModal} />
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email Quote</h3>
                      <p className="text-sm text-gray-500">
                        Compose an email with pricing and send it directly to the customer.
                      </p>
                    </div>
                    <button
                      onClick={resetQuoteEmailModal}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                      <input
                        type="text"
                        value={quoteEmailModal.subject}
                        onChange={(e) =>
                          setQuoteEmailModal((prev) => ({ ...prev, subject: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quoted Amount (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={quoteEmailModal.quotedAmount}
                          onChange={(e) =>
                            setQuoteEmailModal((prev) => ({
                              ...prev,
                              quotedAmount: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter total amount"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Leave blank if you only need to send a message.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Notes
                        </label>
                        <input
                          type="text"
                          value={quoteEmailModal.additionalNotes}
                          onChange={(e) =>
                            setQuoteEmailModal((prev) => ({ ...prev, additionalNotes: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Optional note to include below pricing"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                      <textarea
                        value={quoteEmailModal.message}
                        onChange={(e) =>
                          setQuoteEmailModal((prev) => ({ ...prev, message: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={6}
                        required
                      />
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                      onClick={resetQuoteEmailModal}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendQuoteEmail}
                      disabled={quoteEmailModal.sending}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                    >
                      {quoteEmailModal.sending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="space-y-6">
            {renderStatusBanner(pickupStatus)}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Upload Requests</h2>
                  <p className="text-sm text-gray-500">
                    Customers who used the Upload Files module appear here for pickup processing.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(['all', 'new', 'printed', 'collected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setPickupFilter(status)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition ${
                        pickupFilter === status
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                    onClick={() => loadPickups(pickupFilter)}
                  >
                    <RefreshCcw className={`w-4 h-4 ${pickupsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pickup
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Files
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pickupsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading uploads...
                          </div>
                        </td>
                      </tr>
                    ) : filteredPickups.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No uploads found for this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredPickups.map((pickup) => (
                        <tr key={pickup._id}>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{pickup.pickupCode}</p>
                            <p className="text-xs text-gray-500">
                              {pickup.files.length} file{pickup.files.length !== 1 ? 's' : ''}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1 text-sm text-gray-700">
                              {pickup.customer.phone && <p>{pickup.customer.phone}</p>}
                              {pickup.customer.email && (
                                <p className="flex items-center gap-1 text-blue-600">
                                  <Mail className="w-3 h-3" />
                                  {pickup.customer.email}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 space-y-2">
                            {pickup.files.map((file, index) => (
                              <div key={file.key + index} className="flex items-center justify-between text-xs">
                                <div className="pr-2 text-gray-600 truncate">
                                  {file.name}{' '}
                                  <span className="text-gray-400">
                                    • {file.copies} copy{file.copies !== 1 ? 'ies' : 'y'} •{' '}
                                    {file.colorMode === 'grayscale' ? 'B/W' : 'Colour'} • {file.paperSize || 'A4'}
                                  </span>
                                </div>
                                <a
                                  href={file.downloadUrl || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                                    file.downloadUrl
                                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </a>
                              </div>
                            ))}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                pickup.status === 'printed'
                                  ? 'bg-amber-100 text-amber-700'
                                  : pickup.status === 'collected'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(pickup.createdAt).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
