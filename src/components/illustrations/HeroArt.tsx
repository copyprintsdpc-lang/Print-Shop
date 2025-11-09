'use client'

import React from 'react'

export default function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 240" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hero_bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#94A3B8" floodOpacity="0.35" />
        </filter>
      </defs>
      <rect width="1024" height="240" rx="16" fill="url(#hero_bg)"/>

      {/* Notebook */}
      <g transform="translate(540,26) rotate(-10)" filter="url(#shadow)">
        <rect x="0" y="0" width="420" height="200" rx="12" fill="#FFFFFF" />
        <rect x="18" y="18" width="384" height="36" rx="8" fill="#FDE68A" />
        <rect x="18" y="70" width="320" height="10" rx="5" fill="#E5E7EB" />
        <rect x="18" y="90" width="280" height="10" rx="5" fill="#E5E7EB" />
        <rect x="18" y="110" width="360" height="10" rx="5" fill="#E5E7EB" />
        <rect x="18" y="130" width="300" height="10" rx="5" fill="#E5E7EB" />
      </g>

      {/* Sheets */}
      <g transform="translate(60,48)" filter="url(#shadow)">
        <rect x="0" y="24" width="420" height="160" rx="12" fill="#fff"/>
        <rect x="28" y="50" width="260" height="12" rx="6" fill="#E5E7EB"/>
        <rect x="28" y="72" width="320" height="12" rx="6" fill="#E5E7EB"/>
        <rect x="28" y="94" width="220" height="12" rx="6" fill="#E5E7EB"/>
      </g>
    </svg>
  )
}


