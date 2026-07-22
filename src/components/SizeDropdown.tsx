'use client'

import { useState, useRef, useEffect } from 'react'

type Option = {
  value: string
  label: string
}

type Props = {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder: string
}

export default function SizeDropdown({ value, onChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

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
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full border rounded-lg px-3 py-2 bg-white text-black text-left flex items-center justify-between btn-pop"
      >
        <span className={selected ? 'text-black' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      <div className={`absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg overflow-y-auto max-h-48 transition-all duration-200 origin-top ${
        open ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
      }`}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onChange(option.value)
              setOpen(false)
            }}
            className={`w-full text-left px-3 py-2 text-sm text-black hover:bg-gray-50 ${
              option.value === value ? 'bg-gray-100 font-medium' : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}