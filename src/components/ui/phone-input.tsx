'use client'

import { useState } from 'react'
import type { PhoneFormat } from '@/types/profile'

interface PhoneInputProps {
  value: string
  onChange: (value: string, format: PhoneFormat) => void
  format: PhoneFormat
}

export default function PhoneInput({ value, onChange, format }: PhoneInputProps) {
  const [localFormat, setLocalFormat] = useState<PhoneFormat>(format)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue, localFormat)
  }

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.target.value as PhoneFormat
    setLocalFormat(newFormat)
    onChange('', newFormat)
  }

  return (
    <div className="flex gap-2">
      <select
        value={localFormat}
        onChange={handleFormatChange}
        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="ve">VE +58</option>
        <option value="international">Intl +XX</option>
      </select>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={localFormat === 've' ? '04141234567' : '+1234567890'}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}
