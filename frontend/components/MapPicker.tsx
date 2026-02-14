'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, X, Loader2, Navigation } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void
  initialLocation?: { lat: number; lng: number }
  className?: string
}

export function MapPicker({ onLocationSelect, initialLocation, className = '' }: MapPickerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address?: string
  } | null>(initialLocation || null)
  const [loading, setLoading] = useState(false)
  const [manualLat, setManualLat] = useState(initialLocation?.lat.toString() || '')
  const [manualLng, setManualLng] = useState(initialLocation?.lng.toString() || '')
  const [showManualInput, setShowManualInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Default center: Dhaka, Bangladesh
  const DEFAULT_CENTER: [number, number] = [23.8103, 90.4125]
  const DEFAULT_ZOOM = 12

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapRef.current) {
      return
    }

    // Create map
    const map = L.map(mapContainerRef.current).setView(
      initialLocation ? [initialLocation.lat, initialLocation.lng] : DEFAULT_CENTER,
      DEFAULT_ZOOM
    )

    // Add OpenStreetMap tiles (free, no API key needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Add click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      handleMapClick(e.latlng.lat, e.latlng.lng)
    })

    mapRef.current = map

    // Add initial marker if location provided
    if (initialLocation) {
      addMarker(initialLocation.lat, initialLocation.lng)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const addMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove()
    }

    // Add new marker
    const marker = L.marker([lat, lng]).addTo(mapRef.current)
    marker.bindPopup(`Selected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup()
    markerRef.current = marker

    // Pan to marker
    mapRef.current.panTo([lat, lng])
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      setLoading(true)
      // OpenStreetMap Nominatim - Free reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          new URLSearchParams({
            format: 'json',
            lat: lat.toString(),
            lon: lng.toString(),
            zoom: '18',
            addressdetails: '1',
          }),
        {
          headers: {
            'User-Agent': 'NextJS-App', // Nominatim requires User-Agent
          },
        }
      )

      if (!response.ok) {
        throw new Error('Geocoding failed')
      }

      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } finally {
      setLoading(false)
    }
  }

  const handleMapClick = async (lat: number, lng: number) => {
    addMarker(lat, lng)
    const address = await reverseGeocode(lat, lng)
    
    const location = { lat, lng, address }
    setSelectedLocation(location)
    setManualLat(lat.toString())
    setManualLng(lng.toString())
    onLocationSelect(location)
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude')
      return
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Latitude must be between -90 and 90, Longitude between -180 and 180')
      return
    }

    addMarker(lat, lng)
    const address = await reverseGeocode(lat, lng)
    
    const location = { lat, lng, address }
    setSelectedLocation(location)
    onLocationSelect(location)
    setShowManualInput(false)
  }

  const handleClear = () => {
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
    setSelectedLocation(null)
    setManualLat('')
    setManualLng('')
    onLocationSelect({ lat: 0, lng: 0 })
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        await handleMapClick(lat, lng)
      },
      (error) => {
        console.log('Geolocation access denied or unavailable:', error.message)
        alert('Unable to get your location. Please click on the map or enter coordinates manually.')
        setLoading(false)
      }
    )
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // OpenStreetMap Nominatim search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: searchQuery,
            format: 'json',
            limit: '5',
            countrycodes: 'bd', // Limit to Bangladesh
            addressdetails: '1',
          }),
        {
          headers: {
            'User-Agent': 'NextJS-App',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchResults(data)

      if (data.length === 0) {
        alert('No results found. Try a different search term.')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectSearchResult = async (result: any) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    
    await handleMapClick(lat, lng)
    setSearchResults([])
    setSearchQuery('')
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Pickup Location
        </label>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a place (e.g., Gulshan, Dhaka)"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSearchResult(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {result.display_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {result.type} • {result.class}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>Use Current Location</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition-colors text-sm"
          >
            {showManualInput ? 'Hide Manual Input' : 'Enter Coordinates Manually'}
          </button>
        </div>

        {/* Manual Input */}
        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Enter Location Coordinates
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-blue-700 dark:text-blue-400 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="23.8103"
                  className="w-full px-3 py-2 rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-blue-700 dark:text-blue-400 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="90.4125"
                  className="w-full px-3 py-2 rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
            >
              Set Location
            </button>
          </form>
        )}

        {/* Map Container */}
        <div 
          ref={mapContainerRef}
          className="h-96 w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-lg overflow-hidden"
        />

        {/* Help Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Click anywhere on the map to select your pickup location, or use the buttons above
        </p>

        {/* Selected Location Display */}
        {selectedLocation && selectedLocation.lat !== 0 && (
          <div className="flex items-start justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                  Selected Pickup Location
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 break-words mb-1">
                  {selectedLocation.address || 'Getting address...'}
                </p>
                <p className="text-xs text-green-500 dark:text-green-500 font-mono">
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="ml-3 p-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors flex-shrink-0"
              aria-label="Clear location"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Getting address...</span>
          </div>
        )}
      </div>
    </div>
  )
}
