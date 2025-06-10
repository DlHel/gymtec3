'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from './label'
import dynamic from 'next/dynamic'

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import('./map'), {
  ssr: false,
})

interface Suggestion {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface AddressAutocompleteProps {
  name: string
  label: string
  defaultValue?: string
  required?: boolean
  onAddressSelect: (address: string) => void
}

export const AddressAutocomplete = ({
  name,
  label,
  defaultValue = '',
  required = false,
  onAddressSelect,
}: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<[number, number]>([-33.45694, -70.64827]) // Default to Santiago
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([])
        return
      }
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&countrycodes=cl`
        )
        const data = await response.json()
        setSuggestions(data)
        if (data.length > 0) {
            setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        }
        setIsOpen(true)
      } catch (error) {
        console.error('Error fetching address suggestions:', error)
        setSuggestions([])
      }
    }

    const timerId = setTimeout(fetchSuggestions, 500)
    return () => clearTimeout(timerId)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (suggestion: Suggestion) => {
    const address = suggestion.display_name
    setQuery(address)
    onAddressSelect(address)
    setPosition([parseFloat(suggestion.lat), parseFloat(suggestion.lon)])
    setIsOpen(false)
  }

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="relative">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            onAddressSelect(e.target.value)
          }}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          placeholder="Empieza a escribir una dirección..."
          required={required}
          autoComplete="off"
        />
        {isOpen && suggestions.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="h-64 w-full rounded-md z-10">
        <MapWithNoSSR position={position} />
      </div>
    </div>
  )
} 