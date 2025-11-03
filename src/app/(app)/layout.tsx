import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import AppAuthGuard from '@/components/AppAuthGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sri Datta Print Center - Web Application',
  description: 'Order printing services, manage your projects, and track orders online.',
  keywords: 'online printing, order management, print shop, custom printing',
  authors: [{ name: 'Sri Datta Print Center' }],
}

// Dynamic app layout with full navigation, cart, auth
// ALL app pages require login by default (except public exceptions)
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className}`}>
        <AuthProvider>
          <AppAuthGuard>
            <Navigation />
            <main>
              {children}
            </main>
            <Footer />
          </AppAuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}

