import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sri Datta Print Center - Professional Digital Printing Services',
  description: 'Professional copy and print services for all your business and personal needs. Fast, reliable, and affordable printing solutions with same-day delivery options.',
  keywords: 'digital printing, copy services, business cards, banners, stickers, same day printing, professional printing',
  authors: [{ name: 'Sri Datta Print Center' }],
  openGraph: {
    title: 'Sri Datta Print Center - Professional Digital Printing Services',
    description: 'Professional copy and print services with same-day delivery options',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className}`}>
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
