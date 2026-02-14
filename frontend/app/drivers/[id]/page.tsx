'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { mockDrivers } from '@/lib/mockData'
import { Driver } from '@/types'
import { PromoCode, calculateDiscount } from '@/lib/promoCodes'
import { MapPin, Star, Car, ChevronLeft, Languages, Award, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Reviews } from '@/components/Reviews'
import { PromoCodeInput } from '@/components/PromoCodeInput'

export default function DriverDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const driverId = params.id as string
  const { user } = useAuth()
  const [driver, setDriver] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null)

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/drivers/${driverId}`)
        if (response.ok) {
          const data = await response.json()
          setDriver(data.data)
        }
      } catch (error) {
        console.error('Error fetching driver:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDriver()
  }, [driverId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Driver not found
          </h2>
          <Button onClick={() => router.push('/drivers')}>Back to Drivers</Button>
        </div>
      </div>
    )
  }

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) : 0
  const pricePerDay = parseFloat(driver.price_per_day || 1500)
  const subtotal = days * pricePerDay
  const discount = appliedPromoCode ? calculateDiscount(appliedPromoCode, subtotal) : 0
  const serviceCharge = subtotal > 0 ? Math.max(100, Math.round(subtotal * 0.05)) : 0 // 5% service charge, minimum ৳100
  const totalPrice = subtotal - discount + serviceCharge

  const handleBookNow = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Check if user is a business account
      const businessRoles = ['car_owner', 'hotel_owner', 'driver', 'tour_guide']
      if (user && businessRoles.includes(user.role)) {
        alert('Business accounts cannot book services. Please create or log in with a Traveler account.')
        return
      }

      const bookingData = {
        booking_type: 'driver',
        driver_id: parseInt(driverId),
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
        alert('Driver booking successful!')
        router.push('/dashboard')
      } else {
        alert(data.message || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred while creating the booking')
    }
  }

  const languages = Array.isArray(driver.languages) ? driver.languages : (typeof driver.languages === 'string' ? JSON.parse(driver.languages) : ['Bengali', 'English'])

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
          {/* Left Column - Driver Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <Card>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-64 md:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  {driver.photo_url ? (
                    <Image
                      src={driver.photo_url}
                      alt={driver.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Car className="w-24 h-24" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {driver.name}
                      </h1>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                        <MapPin className="w-5 h-5" />
                        <span>{driver.location || 'Dhaka'}, {driver.city || 'Dhaka'}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(driver.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          {driver.rating} ({driver.total_rides || 0} rides)
                          {driver.reviews && driver.reviews.length > 0 && ` • ${driver.reviews.length} reviews`}
                        </span>
                      </div>
                    </div>
                    {driver.available && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Available</span>
                      </span>
                    )}
                  </div>

                  {driver.bio && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{driver.bio}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span>{driver.experience_years || 0} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Languages className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span>{languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <div>
              <Reviews reviews={driver.reviews || []} />
            </div>
          </div>

          {/* Right Column - Booking */}
          <div>
            {(!user || user?.role === 'traveler') ? (
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Book This Driver
                </h3>

              <div className="space-y-4">
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
                      ৳{(driver.price_per_day || 1500).toLocaleString()}
                    </span>
                  </div>
                  {days > 0 && (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          {days} day{days !== 1 ? 's' : ''}
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
                  disabled={!startDate || !endDate || !driver.available}
                >
                  {!driver.available ? 'Not Available' : (!user ? 'Login to Book' : 'Book Now')}
                </Button>
              </div>
            </Card>
            ) : (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                <div className="text-center p-6">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Business Account</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Business accounts cannot book services. To hire a driver, please create or log in with a Traveler account.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
