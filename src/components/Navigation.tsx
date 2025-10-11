'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  Phone,
  MapPin,
  Clock,
  LogOut
} from 'lucide-react'
import Cart from './Cart'
import { useCart } from './Cart'
import { useAuth } from '@/contexts/AuthContext'

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
  const [cartOpen, setCartOpen] = useState(false)
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const { user, logout, isAuthenticated } = useAuth()

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
      <div className="bg-gray-100 text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Hotline: 00 1900 8188</span>
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
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img 
                  src="/sdpclogo.png" 
                  alt="Sri Datta Print Centre" 
                  className="header-logo h-56 w-auto"
                />
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
                            ? 'text-black bg-gray-100'
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </Link>

                      {false && openMenu === 'services' && (
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
                          ? 'text-black bg-gray-100'
                          : 'text-gray-700 hover:text-black hover:bg-gray-50'
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
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {user?.name || user?.email}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </>
              )}
              <button
                onClick={() => setCartOpen(true)}
                className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              </button>
              <Link
                href="/quote"
                className="btn-primary text-sm px-4 py-2"
              >
                Start A Project
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-black p-2 rounded-md"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-black bg-gray-100'
                      : 'text-gray-700 hover:text-black hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      {user?.name || user?.email}
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black w-full text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                    <Link
                      href="/login"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setCartOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black w-full text-left"
                >
                  Cart ({getItemCount()})
                </button>
                <Link
                  href="/quote"
                  className="block px-3 py-2 text-base font-medium text-white rounded-lg text-center bg-black hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start A Project
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Shopping Cart */}
      <Cart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false)
          window.location.href = '/checkout'
        }}
      />
    </>
  )
}
