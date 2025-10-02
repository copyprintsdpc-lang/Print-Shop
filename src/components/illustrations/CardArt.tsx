'use client'

import React from 'react'

export default function CardArt({ theme = 'blue', className = '' }: { theme?: 'blue' | 'teal' | 'rose'; className?: string }) {
  const bg = theme === 'blue' ? '#DBEAFE' : theme === 'teal' ? '#CCFBF1' : '#FFE4E6'
  return (
    <svg viewBox="0 0 512 176" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="176" rx="12" fill={bg} />
      <g transform="translate(40,28)">
        <rect x="0" y="0" width="432" height="120" rx="10" fill="#fff" stroke="#E5E7EB" />
        <rect x="24" y="24" width="220" height="12" rx="6" fill="#E5E7EB" />
        <rect x="24" y="48" width="300" height="12" rx="6" fill="#E5E7EB" />
        <rect x="24" y="72" width="180" height="12" rx="6" fill="#E5E7EB" />
      </g>
    </svg>
  )
}


