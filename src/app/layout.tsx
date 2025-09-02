import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CopyPrint Shop - Professional Digital Printing Services',
  description: 'Professional copy and print services for all your business and personal needs. Fast, reliable, and affordable printing solutions with same-day delivery options.',
  keywords: 'digital printing, copy services, business cards, banners, stickers, same day printing, professional printing',
  authors: [{ name: 'CopyPrint Shop' }],
  openGraph: {
    title: 'CopyPrint Shop - Professional Digital Printing Services',
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
      <body className={`${inter.className} h-full min-h-screen bg-[radial-gradient(1200px_700px_at_50%_115%,#F16E02_0%,#F16518_22%,#DC6342_40%,rgba(255,255,255,0)_62%),linear-gradient(180deg,#181819_0%,#1E2735_25%,#37507B_45%,#9C80B1_65%,#181819_100%)] bg-no-repeat bg-cover`}>
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
