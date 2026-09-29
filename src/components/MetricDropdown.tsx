'use client'

import { useState, useRef, useEffect } from 'react'

type SizeSystem = 'BR' | 'EU' | 'US' | 'CN' | 'AU' | 'cm'

type Props = {
  value: SizeSystem
  onChange: (value: SizeSystem) => void
}

const OPTIONS: SizeSystem[] = ['BR', 'EU', 'US', 'CN', 'AU', 'cm']

export default function MetricDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative w-24 flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full border rounded-lg px-3 py-2 bg-black/15 text-white text-left flex items-center justify-between btn-pop"
      >
        <span className="text-gray-300 text-stroke bold-text">{value}</span>
        <span className={`transition-transform duration-300 text-white/80 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      <div className={`absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top ${
        open ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
      }`}>
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => { onChange(opt); setOpen(false) }}
            className={`w-full text-left px-3 py-2 text-black transition-colors duration-600 hover:duration-0 hover:bg-black/30 ${
              opt === value ? 'bg-gray-100 font-medium' : ''
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}