'use client'

import React from 'react'

interface PlaceholderImageProps {
  label: string
  className?: string
}

export default function PlaceholderImage({ label, className = '' }: PlaceholderImageProps) {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="320" height="200" rx="12" fill="url(#g1)" />
        <rect x="36" y="32" width="248" height="136" rx="10" fill="#ffffff" stroke="#cbd5e1" />
        <rect x="60" y="56" width="200" height="10" rx="5" fill="#e5e7eb" />
        <rect x="60" y="78" width="160" height="10" rx="5" fill="#e5e7eb" />
        <rect x="60" y="100" width="180" height="10" rx="5" fill="#e5e7eb" />
        <rect x="60" y="122" width="120" height="10" rx="5" fill="#e5e7eb" />
        <text x="160" y="186" textAnchor="middle" fontFamily="Inter, Arial, Helvetica, sans-serif" fontSize="16" fill="#6b7280">
          {label}
        </text>
      </svg>
    </div>
  )
}


