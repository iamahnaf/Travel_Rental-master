'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { mockHotels } from '@/lib/mockData'
import { Hotel } from '@/types'
import { PromoCode, calculateDiscount } from '@/lib/promoCodes'
import { MapPin, Star, Bed, ChevronLeft, ChevronRight, Wifi, UtensilsCrossed, Lock, Clock, Car } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Reviews } from '@/components/Reviews'
import { PromoCodeInput } from '@/components/PromoCodeInput'
import { NIDUpload } from '@/components/NIDUpload'

export default function HotelDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.id as string
  const { user } = useAuth()
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null)
  const [showNIDUpload, setShowNIDUpload] = useState(false)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/hotels/${hotelId}`)
        if (response.ok) {
          const data = await response.json()
          setHotel(data.data)
        }
      } catch (error) {
        console.error('Error fetching hotel:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [hotelId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Hotel not found
          </h2>
          <Button onClick={() => router.push('/hotels')}>Back to Hotels</Button>
        </div>
      </div>
    )
  }

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))) : 0
  const pricePerNight = parseFloat(hotel.price_per_night || 0)
  const subtotal = days * pricePerNight * guests
  const discount = appliedPromoCode ? calculateDiscount(appliedPromoCode, subtotal) : 0
  const serviceCharge = subtotal > 0 ? Math.max(100, Math.round(subtotal * 0.05)) : 0 // 5% service charge, minimum ৳100
  const totalPrice = subtotal - discount + serviceCharge

  const handleBookNow = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login to book a hotel')
      router.push('/login')
      return
    }

    // Check if user already has an approved NID
    try {
      const nidResponse = await fetch('http://localhost:5001/api/nids/my-nid', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (nidResponse.ok) {
        const nidData = await nidResponse.json()
        console.log('NID check response:', nidData)
        // User has NID, proceed directly to booking
        if (nidData.success && nidData.data) {
          await proceedWithBooking()
          return
        }
      }
    } catch (error) {
      console.error('Error checking NID status:', error)
    }

    // No approved NID found, show upload modal
    setShowNIDUpload(true)
  }

  const proceedWithBooking = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to complete booking')
        router.push('/login')
        return
      }

      const bookingData = {
        booking_type: 'hotel',
        hotel_id: parseInt(hotelId),
        start_date: startDate,
        end_date: endDate,
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
        setShowNIDUpload(false)
        alert('Hotel booking successful!')
        router.push('/dashboard')
      } else {
        alert(data.message || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred while creating the booking')
    }
  }

  const handleNIDComplete = async (nidData: { number: string; file: File }) => {
    // NID uploaded, now proceed with booking
    await proceedWithBooking()
  }

  const images = Array.isArray(hotel.image_urls) ? hotel.image_urls : (typeof hotel.image_urls === 'string' ? JSON.parse(hotel.image_urls) : [])
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : (typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    Breakfast: UtensilsCrossed,
    Lockers: Lock,
    '24/7 Reception': Clock,
    Parking: Car,
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Images - Sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="p-0 overflow-hidden">
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                {images[currentImageIndex] ? (
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Bed className="w-32 h-32" />
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
                {hotel.name}
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{hotel.location}, {hotel.city}</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(hotel.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {hotel.rating} ({hotel.available_rooms || 0} rooms available)
                  {hotel.reviews && hotel.reviews.length > 0 && ` • ${hotel.reviews.length} reviews`}
                </span>
              </div>
            </div>

            {hotel.description && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{hotel.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity: string) => {
                  const Icon = amenityIcons[amenity] || Bed
                  return (
                    <div
                      key={amenity}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span>{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Booking Section */}
            {user?.role === 'traveler' ? (
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Booking Details
                </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Check-in
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
                      Check-out
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
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
                    <span className="text-gray-600 dark:text-gray-400">Price per night</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ৳{(hotel.price_per_night || 0).toLocaleString()}
                    </span>
                  </div>
                  {days > 0 && (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          {days} night{days !== 1 ? 's' : ''} × {guests} guest{guests !== 1 ? 's' : ''}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ৳{subtotal.toLocaleString()}
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
                  disabled={!startDate || !endDate || hotel.available_rooms === 0}
                >
                  {hotel.available_rooms === 0 ? 'No Rooms Available' : 'Book Now'}
                </Button>
              </div>
            </Card>
            ) : (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                <div className="text-center p-6">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Business Account</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Business accounts cannot book services. To book a hotel, please create or log in with a Traveler account.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {hotel.reviews && hotel.reviews.length > 0 && (
          <div className="mt-8">
            <Reviews reviews={hotel.reviews} />
          </div>
        )}
      </div>

      {/* NID Upload Modal */}
      {showNIDUpload && (
        <NIDUpload
          onClose={() => setShowNIDUpload(false)}
          onComplete={handleNIDComplete}
        />
      )}
    </div>
  )
}
