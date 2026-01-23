'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { mockDrivers } from '@/lib/mockData'
import { Vehicle, Driver } from '@/types'
import { PromoCode, calculateDiscount } from '@/lib/promoCodes'
import { Car, Users, Fuel, Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DriverSelection } from '@/components/DriverSelection'
import { LicenseUpload } from '@/components/LicenseUpload'
import { PromoCodeInput } from '@/components/PromoCodeInput'
import { MapPicker } from '@/components/MapPickerWrapper'

export default function VehicleDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string
  const { user, isAuthenticated } = useAuth()
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [drivers, setDrivers] = useState<any[]>([])

  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [withDriver, setWithDriver] = useState(false)
  const [showDriverSelection, setShowDriverSelection] = useState(false)
  const [showLicenseUpload, setShowLicenseUpload] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null)
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [destinationLocation, setDestinationLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [showDestMapPicker, setShowDestMapPicker] = useState(false)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/vehicles/${vehicleId}`)
        if (response.ok) {
          const data = await response.json()
          setVehicle(data.data)
        } else {
          setVehicle(null)
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        setVehicle(null)
      } finally {
        setLoading(false)
      }
    }

    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/drivers')
        if (response.ok) {
          const data = await response.json()
          setDrivers(data.data)
        }
      } catch (error) {
        console.error('Error fetching drivers:', error)
      }
    }

    fetchVehicle()
    fetchDrivers()
  }, [vehicleId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Vehicle not found
          </h2>
          <Button onClick={() => router.push('/vehicles')}>Back to Vehicles</Button>
        </div>
      </div>
    )
  }

  // Map API field names to frontend format
  const images = vehicle.images ? JSON.parse(vehicle.images) : (vehicle.image_url ? [vehicle.image_url] : [])
  const pricePerDay = withDriver ? (vehicle.with_driver_price || vehicle.price_per_day) : vehicle.price_per_day
  const days = startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
  const subtotal = days * pricePerDay
  const discount = appliedPromoCode ? calculateDiscount(appliedPromoCode, subtotal) : 0
  const serviceCharge = subtotal > 0 ? Math.max(100, Math.round(subtotal * 0.05)) : 0 // 5% service charge, minimum ৳100
  const totalPrice = subtotal - discount + serviceCharge

  const handleBookNow = async () => {
    if (!withDriver) {
      // Check if user already has an approved driving license
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('Please login to continue')
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:5001/api/licenses/check', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (response.ok && data.data && data.data.hasApprovedLicense) {
          // User already has approved license, go directly to booking
          handleBookingComplete()
        } else {
          // No approved license, show upload modal
          setShowLicenseUpload(true)
        }
      } catch (error) {
        console.error('Error checking license:', error)
        // On error, show upload modal to be safe
        setShowLicenseUpload(true)
      }
    } else {
      setShowDriverSelection(true)
    }
  }

  const handleLicenseComplete = () => {
    setShowLicenseUpload(false)
    // Create booking after license is uploaded
    handleBookingComplete()
  }

  const handleBookingComplete = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to complete booking')
        router.push('/login')
        return
      }

      const bookingData = {
        booking_type: 'vehicle',
        vehicle_id: parseInt(vehicleId),
        driver_id: selectedDriver ? parseInt(selectedDriver.id) : null,
        start_date: startDate,
        end_date: endDate,
        pickup_lat: pickupLocation?.lat,
        pickup_lng: pickupLocation?.lng,
        pickup_address: pickupLocation?.address || '',
        destination_lat: destinationLocation?.lat,
        destination_lng: destinationLocation?.lng,
        destination_address: destinationLocation?.address || '',
        total_price: totalPrice,
        promo_code_id: (appliedPromoCode as any)?.id || null
      }

      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (response.ok) {
        alert('Booking successful!')
        router.push('/dashboard')
      } else {
        console.error('Booking failed:', data)
        alert(data.message || data.error || 'Booking failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Booking error:', error)
      alert('An error occurred while creating the booking: ' + (error.message || 'Unknown error'))
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Carousel - Sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="p-0 overflow-hidden">
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                {images[currentImageIndex] ? (
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${vehicle.brand} ${vehicle.model} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Car className="w-32 h-32" />
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 smooth-transition z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 smooth-transition z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                      {images.map((_: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full ${
                            i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{vehicle.year}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <Fuel className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>{vehicle.fuel_type}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>{vehicle.seats} Seats</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>{vehicle.transmission}</span>
              </div>
              {vehicle.default_fuel_included && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <Check className="w-5 h-5" />
                  <span>Fuel Included</span>
                </div>
              )}
            </div>

            {vehicle.description && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{vehicle.description}</p>
              </div>
            )}

            {/* Booking Section */}
            {user?.role === 'traveler' ? (
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Booking Details
                </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="driver"
                      checked={!withDriver}
                      onChange={() => {
                        setWithDriver(false)
                        setSelectedDriver(null)
                      }}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Without Driver</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="driver"
                      checked={withDriver}
                      onChange={() => setWithDriver(true)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">With Driver</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pickup Location
                  </label>
                  {!showMapPicker ? (
                    <div className="space-y-2">
                      {pickupLocation && pickupLocation.lat !== 0 ? (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                            Selected Location
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {pickupLocation.address || `${pickupLocation.lat.toFixed(6)}, ${pickupLocation.lng.toFixed(6)}`}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          No location selected
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMapPicker(true)}
                        className="w-full"
                      >
                        {pickupLocation && pickupLocation.lat !== 0 ? 'Change Location' : 'Select Pickup Location on Map'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2" key="map-picker-container">
                      <MapPicker
                        key={`map-picker-${showMapPicker}`}
                        onLocationSelect={(location) => {
                          setPickupLocation(location)
                          setShowMapPicker(false)
                        }}
                        initialLocation={pickupLocation && pickupLocation.lat !== 0 ? { lat: pickupLocation.lat, lng: pickupLocation.lng } : undefined}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMapPicker(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Destination Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destination Location
                  </label>
                  {!showDestMapPicker ? (
                    <div className="space-y-2">
                      {destinationLocation && destinationLocation.lat !== 0 ? (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                            Selected Destination
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {destinationLocation.address || `${destinationLocation.lat.toFixed(6)}, ${destinationLocation.lng.toFixed(6)}`}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          No destination selected
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDestMapPicker(true)}
                        className="w-full"
                      >
                        {destinationLocation && destinationLocation.lat !== 0 ? 'Change Destination' : 'Select Destination on Map'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <MapPicker
                        onLocationSelect={(location) => {
                          setDestinationLocation(location)
                          setShowDestMapPicker(false)
                        }}
                        initialLocation={destinationLocation && destinationLocation.lat !== 0 ? { lat: destinationLocation.lat, lng: destinationLocation.lng } : undefined}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDestMapPicker(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {days > 0 && (
                  <>
                    <PromoCodeInput
                      subtotal={subtotal}
                      onApply={setAppliedPromoCode}
                      appliedCode={appliedPromoCode}
                    />
                  </>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Price per day</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ৳{pricePerDay.toLocaleString()}
                    </span>
                  </div>
                  {days > 0 && (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Days</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {days}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ৳{subtotal.toLocaleString()}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between mb-2 text-green-600 dark:text-green-400">
                          <span>Discount ({appliedPromoCode?.code})</span>
                          <span className="font-semibold">-৳{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Service Charge</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ৳{serviceCharge.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          ৳{totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={handleBookNow}
                  className="w-full"
                  size="lg"
                  disabled={!startDate || !endDate || !pickupLocation || pickupLocation.lat === 0 || !destinationLocation || destinationLocation.lat === 0}
                >
                  {(!pickupLocation || pickupLocation.lat === 0) ? 'Please Select Pickup Location' : 
                   (!destinationLocation || destinationLocation.lat === 0) ? 'Please Select Destination' : 'Book Now'}
                </Button>
              </div>
            </Card>
            ) : (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                <div className="text-center p-6">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Business Account</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Business accounts cannot book services. To book a vehicle, please create or log in with a Traveler account.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Driver Selection Modal */}
      {showDriverSelection && (
        <DriverSelection
          drivers={drivers}
          selectedDriver={selectedDriver}
          onSelectDriver={setSelectedDriver}
          onClose={() => setShowDriverSelection(false)}
          onConfirm={handleBookingComplete}
        />
      )}

      {/* License Upload Modal */}
      {showLicenseUpload && (
        <LicenseUpload
          onClose={() => setShowLicenseUpload(false)}
          onComplete={handleLicenseComplete}
        />
      )}
    </div>
  )
}
