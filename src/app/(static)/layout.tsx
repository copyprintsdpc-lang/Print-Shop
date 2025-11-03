import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Footer from '@/components/Footer'
import StaticNavigationClient from '@/components/StaticNavigationClient'

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

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className}`}>
        <StaticNavigationClient />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

