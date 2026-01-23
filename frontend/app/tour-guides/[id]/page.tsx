'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { mockTourGuides } from '@/lib/mockData'
import { TourGuide } from '@/types'
import { PromoCode, calculateDiscount } from '@/lib/promoCodes'
import { MapPin, Star, User, ChevronLeft, Languages, Award, Calendar, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Reviews } from '@/components/Reviews'
import { PromoCodeInput } from '@/components/PromoCodeInput'

export default function TourGuideDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const guideId = params.id as string
  const { user } = useAuth()
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null)

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/tour-guides/${guideId}`)
        if (response.ok) {
          const data = await response.json()
          setGuide(data.data)
        }
      } catch (error) {
        console.error('Error fetching tour guide:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGuide()
  }, [guideId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Tour Guide not found
          </h2>
          <Button onClick={() => router.push('/tour-guides')}>Back to Tour Guides</Button>
        </div>
      </div>
    )
  }

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) : 0
  const pricePerDay = parseFloat(guide.price_per_day || 2000)
  const subtotal = days * pricePerDay
  const discount = appliedPromoCode ? calculateDiscount(appliedPromoCode, subtotal) : 0
  const serviceCharge = subtotal > 0 ? Math.max(100, Math.round(subtotal * 0.05)) : 0 // 5% service charge, minimum ৳100
  const totalPrice = subtotal - discount + serviceCharge

  const handleBookNow = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to complete booking')
        router.push('/login')
        return
      }

      const bookingData = {
        booking_type: 'tour-guide',
        tour_guide_id: parseInt(guideId),
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
        alert('Tour guide booking successful!')
        router.push('/dashboard')
      } else {
        alert(data.message || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred while creating the booking')
    }
  }

  const languages = Array.isArray(guide.languages) ? guide.languages : (typeof guide.languages === 'string' ? JSON.parse(guide.languages) : ['Bengali', 'English'])
  const specialties = Array.isArray(guide.specialties) ? guide.specialties : (typeof guide.specialties === 'string' ? JSON.parse(guide.specialties) : [])

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
          {/* Left Column - Guide Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <Card>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-64 md:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  {guide.photo_url ? (
                    <Image
                      src={guide.photo_url}
                      alt={guide.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <User className="w-24 h-24" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {guide.name}
                      </h1>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                        <MapPin className="w-5 h-5" />
                        <span>{guide.location}, {guide.city}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(guide.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          {guide.rating} ({guide.total_tours || 0} tours)
                          {guide.reviews && guide.reviews.length > 0 && ` • ${guide.reviews.length} reviews`}
                        </span>
                      </div>
                    </div>
                    {guide.available && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Available</span>
                      </span>
                    )}
                  </div>

                  {guide.bio && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{guide.bio}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span>{guide.experience_years || 0} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Languages className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span>{languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Specialties */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Specialties
              </h2>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty: string) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </Card>

            {/* Reviews Section */}
            {guide.reviews && guide.reviews.length > 0 && (
              <div>
                <Reviews reviews={guide.reviews} />
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div>
            {user?.role === 'traveler' ? (
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Book This Guide
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
                      ৳{(guide.price_per_day || 2000).toLocaleString()}
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
                  disabled={!startDate || !endDate || !guide.available}
                >
                  {!guide.available ? 'Not Available' : 'Book Now'}
                </Button>
              </div>
            </Card>
            ) : (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                <div className="text-center p-6">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Business Account</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Business accounts cannot book services. To hire a tour guide, please create or log in with a Traveler account.
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
