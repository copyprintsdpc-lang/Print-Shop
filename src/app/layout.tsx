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
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen overflow-x-hidden`}>
        {/* Exact Lovable-style Gradient Background */}
        <div className="fixed inset-0 bg-[radial-gradient(900px_600px_at_50%_110%,#F16E02_0%,#F16518_20%,#DC6342_38%,rgba(255,255,255,0)_60%),linear-gradient(180deg,#181819_0%,#1E2735_25%,#37507B_45%,#9C80B1_65%,#181819_100%)]"></div>
        
        {/* Subtle Edge Vignette */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(120%_80%_at_50%_50%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.28)_100%)]"></div>
        
        {/* Light Film Grain to Prevent Banding */}
        <div 
          className="fixed inset-0 pointer-events-none mix-blend-mode-overlay opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.03'/></svg>")`,
            backgroundSize: '160px 160px',
          }}
        ></div>

        {/* Content with relative positioning */}
        <div className="relative z-10 min-h-screen">
          <Navigation />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
