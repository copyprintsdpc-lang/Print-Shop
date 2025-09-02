'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  Phone,
  MapPin,
  Clock
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Quote', href: '/quote' },
  { name: 'Order', href: '/order' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const pathname = usePathname()

  const quickPrintItems = [
    { name: 'Document Printing', href: '/services/document-printing' },
    { name: 'PrintMe', href: '/services/printme' },
    { name: 'Photo Printing', href: '/services/photo-prints' },
    { name: 'Posters', href: '/services/banners-posters' },
    { name: 'Business Cards', href: '/services/business-cards' },
    { name: 'Banners', href: '/services/banners-posters' },
    { name: 'Flyers', href: '/services/flyers' },
    { name: 'Cards and Invitations', href: '/quote?category=custom' },
    { name: 'Brochures', href: '/services/brochures' },
    { name: 'Mailing and Organization Labels', href: '/services/labels' },
    { name: 'Menus', href: '/services/menus' },
    { name: 'Newsletters', href: '/services/newsletters' },
    { name: 'Postcards', href: '/services/postcards' },
    { name: 'Engineering Prints', href: '/services/banners-posters' },
    { name: 'Calendars', href: '/quote?category=custom' },
  ]

  return (
    <>
      {/* Top bar with contact info */}
      <div className="bg-transparent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Bangalore, Karnataka</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Mon-Sat: 9AM-7PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">CP</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent">CopyPrint Shop</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.map((item) => (
                  item.name === 'Services' ? (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setOpenMenu('services')}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <Link
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'text-orange-300 bg-white/20'
                            : 'text-white hover:text-orange-300 hover:bg-white/10'
                        }`}
                      >
                        {item.name}
                      </Link>

                      {openMenu === 'services' && (
                        <div className="absolute left-0 mt-2 w-[920px] bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl p-6 z-50">
                          <div className="grid grid-cols-12 gap-6">
                            {/* Left column: list */}
                            <div className="col-span-6">
                              <ul className="space-y-3">
                                {quickPrintItems.map((q) => (
                                  <li key={q.name}>
                                    <Link
                                      href={q.href}
                                      className="block text-white hover:text-orange-300"
                                    >
                                      {q.name}
                                    </Link>
                                  </li>
                                ))}
                                <li>
                                  <Link href="/services" className="block text-orange-300 font-medium">View All</Link>
                                </li>
                              </ul>
                            </div>
                            {/* Right column: feature cards */}
                            <div className="col-span-6 grid grid-cols-2 gap-4">
                              <Link href="/quote" className="group border border-white/30 rounded-lg overflow-hidden hover:bg-white/5 transition-all bg-white/5">
                                <div className="h-32 bg-white/10 flex items-center justify-center">
                                  <span className="text-white/70 text-sm">Quick Print</span>
                                </div>
                                <div className="p-4">
                                  <p className="font-semibold text-white group-hover:text-orange-300">Quick and easy printing</p>
                                  <p className="text-sm text-white/70 mt-1">Order by noon for same-day pickup by store closing.</p>
                                  <span className="text-sm text-orange-300 font-medium">Print a document</span>
                                </div>
                              </Link>
                              <Link href="/quote" className="group border border-white/30 rounded-lg overflow-hidden hover:bg-white/5 transition-all bg-white/5">
                                <div className="h-32 bg-white/10 flex items-center justify-center">
                                  <span className="text-white/70 text-sm">PrintMe</span>
                                </div>
                                <div className="p-4">
                                  <p className="font-semibold text-white group-hover:text-orange-300">PrintMe</p>
                                  <p className="text-sm text-white/70 mt-1">Simplified print options to print what you need when you need it.</p>
                                  <span className="text-sm text-orange-300 font-medium">Learn More</span>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-900 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/cart"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link
                href="/quote"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-white hover:text-orange-300 p-2 rounded-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-sm border-t border-white/20">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-orange-300 bg-white/20'
                      : 'text-white hover:text-orange-300 hover:bg-white/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/cart"
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart (0)
                </Link>
                <Link
                  href="/quote"
                  className="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
