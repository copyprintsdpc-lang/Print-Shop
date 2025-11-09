import type { ReactNode } from 'react'
import '../globals.css'

type Props = {
  children: ReactNode
}

export default function AdminGroupLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {children}
    </div>
  )
}
