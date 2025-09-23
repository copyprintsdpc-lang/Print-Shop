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
import { useCart } from '@/contexts/CartContext'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'All Products', href: '/services', hasDropdown: true },
  { name: 'Quote', href: '/quote' },
  { name: 'Order', href: '/order' },
  { name: 'Contact', href: '/contact' },
]

const productCategories = [
  {
    name: 'Stationery & Marketing',
    items: [
      { name: 'Business Cards', href: '/services/business-cards', subItems: [
        { name: 'Standard Business Cards', href: '/services/business-cards' },
        { name: 'Spot UV Business Cards', href: '/services/business-cards?finish=spot-uv' },
        { name: 'Raised Foil Business Cards', href: '/services/business-cards?finish=foil' },
        { name: 'Embossed Business Cards', href: '/services/business-cards?finish=embossed' },
      ]},
      { name: 'Brochures & Flyers', href: '/services/brochures', subItems: [
        { name: 'Half Fold Brochures', href: '/services/brochures?fold=half' },
        { name: 'Tri-Fold Brochures', href: '/services/brochures?fold=tri' },
        { name: 'Z-Fold Brochures', href: '/services/brochures?fold=z' },
        { name: 'Flat Flyers & Brochures', href: '/services/flyers' },
      ]},
      { name: 'Marketing', href: '/services/flyers', subItems: [
        { name: 'Postcards', href: '/services/postcards' },
        { name: 'Posters', href: '/services/banners-posters' },
        { name: 'Greeting Cards', href: '/services/greeting-cards' },
      ]},
      { name: 'Stationery', href: '/services/stationery', subItems: [
        { name: 'Letterheads', href: '/services/letterheads' },
        { name: 'Envelopes', href: '/services/envelopes' },
        { name: 'Bookmarks', href: '/services/bookmarks' },
        { name: 'Magnets', href: '/services/magnets' },
      ]},
    ]
  },
  {
    name: 'Signs & Banners',
    items: [
      { name: 'Banners & Flags', href: '/services/banners-posters', subItems: [
        { name: 'Vinyl Banner', href: '/services/banners-posters?type=vinyl' },
        { name: 'Pull Up Banners', href: '/services/banners-posters?type=pullup' },
        { name: 'Feather Flags', href: '/services/banners-posters?type=feather' },
      ]},
      { name: 'Display Signs', href: '/services/signs', subItems: [
        { name: 'Yard Signs', href: '/services/signs?type=yard' },
        { name: 'A-Frame Signs', href: '/services/signs?type=aframe' },
        { name: 'Acrylic Signs', href: '/services/signs?type=acrylic' },
      ]},
      { name: 'Decals', href: '/services/decals', subItems: [
        { name: 'Window Decals', href: '/services/decals?type=window' },
        { name: 'Wall Decals', href: '/services/decals?type=wall' },
        { name: 'Car Decals', href: '/services/decals?type=car' },
      ]},
    ]
  },
  {
    name: 'Labels & Packaging',
    items: [
      { name: 'Custom Labels', href: '/services/labels', subItems: [
        { name: 'Roll Labels', href: '/services/labels?type=roll' },
        { name: 'Mailing Labels', href: '/services/labels?type=mailing' },
        { name: 'Product Labels', href: '/services/labels?type=product' },
      ]},
      { name: 'Custom Stickers', href: '/services/stickers', subItems: [
        { name: 'Die-Cut Stickers', href: '/services/stickers?type=diecut' },
        { name: 'Sheet Stickers', href: '/services/stickers?type=sheet' },
        { name: 'Clear Stickers', href: '/services/stickers?type=clear' },
      ]},
    ]
  },
  {
    name: 'Document Printing',
    items: [
      { name: 'Black & White Documents', href: '/services/document-printing?type=bw' },
      { name: 'Color Documents', href: '/services/document-printing?type=color' },
      { name: 'Photo Prints', href: '/services/photo-prints' },
      { name: 'PrintMe', href: '/services/printme' },
    ]
  }
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userLoading, setUserLoading] = useState(true)
  const pathname = usePathname()
  const { state: cartState } = useCart()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/strapi/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setUserLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/strapi/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

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
      <nav className="relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                                 <img 
                   src="/logo-dark.svg?v=5" 
                   alt="Sri Datta Print Centre" 
                   className="header-logo"
                   width="350" 
                   height="52"
                 />
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.map((item) => (
                  item.hasDropdown ? (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setOpenMenu('products')}
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

                      {openMenu === 'products' && (
                        <div className="absolute left-0 mt-2 w-[1200px] bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl p-6 z-50">
                          <div className="grid grid-cols-4 gap-8">
                            {productCategories.map((category) => (
                              <div key={category.name}>
                                <h3 className="text-white font-semibold mb-4 text-lg">{category.name}</h3>
                                <ul className="space-y-2">
                                  {category.items.map((item) => (
                                    <li key={item.name}>
                                      <Link
                                        href={item.href}
                                        className="block text-white/80 hover:text-orange-300 transition-colors"
                                      >
                                        {item.name}
                                      </Link>
                                      {item.subItems && (
                                        <ul className="ml-4 mt-1 space-y-1">
                                          {item.subItems.slice(0, 3).map((subItem) => (
                                            <li key={subItem.name}>
                                              <Link
                                                href={subItem.href}
                                                className="block text-white/60 hover:text-orange-300 text-sm transition-colors"
                                              >
                                                {subItem.name}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 pt-6 border-t border-white/20">
                            <div className="flex justify-between items-center">
                              <Link href="/services" className="text-orange-300 font-medium hover:text-orange-200">
                                View All Products
                              </Link>
                              <div className="flex gap-4">
                                <Link href="/quote" className="text-white/80 hover:text-orange-300 text-sm">
                                  Get Quote
                                </Link>
                                <Link href="/design-studio" className="text-white/80 hover:text-orange-300 text-sm">
                                  Design Studio
                                </Link>
                              </div>
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
                          ? 'text-orange-300 bg-white/20'
                          : 'text-white hover:text-orange-300 hover:bg-white/10'
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
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-white hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="text-white hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="text-white hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </>
              )}
              
              <Link
                href="/cart"
                className="text-white hover:text-orange-300 px-3 py-2 rounded-md text-sm font-medium transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/quote"
                className="border border-orange-300/30 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F16518] transition-colors shadow-lg shadow-orange-500/25"
                style={{ backgroundColor: '#F16E02' }}
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
                  href="/signup"
                  className="block px-3 py-2 text-base font-medium text-white hover:text-orange-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-white hover:text-orange-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/cart"
                  className="block px-3 py-2 text-base font-medium text-white hover:text-orange-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({cartState.itemCount})
                </Link>
                <Link
                  href="/quote"
                  className="block px-3 py-2 text-base font-medium text-white rounded-lg text-center hover:bg-[#F16518] transition-colors"
                  style={{ backgroundColor: '#F16E02' }}
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
