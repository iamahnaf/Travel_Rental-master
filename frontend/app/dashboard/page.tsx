'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Booking } from '@/types'
import { Car, Bed, Calendar, MapPin, CheckCircle, Clock, XCircle, FileText, User, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

function BookingCard({ booking, onCancel }: { booking: any, onCancel: (id: number) => void }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  // Use the booking data directly from API response
  const bookingName = booking.booking_type === 'vehicle' 
    ? `${booking.vehicle_brand || ''} ${booking.vehicle_model || ''}`.trim()
    : booking.booking_type === 'hotel'
    ? booking.hotel_name
    : booking.booking_type === 'driver'
    ? booking.driver_name
    : booking.tour_guide_name

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
    confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
    completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
    cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
  }

  const statusIcons: Record<string, any> = {
    pending: Clock,
    confirmed: CheckCircle,
    completed: CheckCircle,
    cancelled: XCircle,
  }

  const StatusIcon = statusIcons[booking.status] || Clock

  const getBookingTypeLabel = () => {
    if (booking.booking_type === 'vehicle') return 'Car Rental'
    if (booking.booking_type === 'hotel') return 'Hotel Booking'
    if (booking.booking_type === 'tour-guide') return 'Tour Guide'
    if (booking.booking_type === 'driver') return 'Driver Booking'
    return 'Booking'
  }

  const getBookingIcon = () => {
    if (booking.booking_type === 'vehicle') {
      return <Car className="w-6 h-6 text-primary-600 dark:text-primary-400" />
    }
    if (booking.booking_type === 'hotel') {
      return <Bed className="w-6 h-6 text-purple-600 dark:text-purple-400" />
    }
    if (booking.booking_type === 'tour-guide') {
      return <User className="w-6 h-6 text-green-600 dark:text-green-400" />
    }
    if (booking.booking_type === 'driver') {
      return <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    }
    return null
  }

  const getBookingIconBg = () => {
    if (booking.booking_type === 'vehicle') return 'bg-primary-100 dark:bg-primary-900/20'
    if (booking.booking_type === 'hotel') return 'bg-purple-100 dark:bg-purple-900/20'
    if (booking.booking_type === 'tour-guide') return 'bg-green-100 dark:bg-green-900/20'
    if (booking.booking_type === 'driver') return 'bg-blue-100 dark:bg-blue-900/20'
    return 'bg-gray-100 dark:bg-gray-900/20'
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${getBookingIconBg()} rounded-lg flex items-center justify-center`}>
            {getBookingIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {bookingName || 'Booking'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getBookingTypeLabel()}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${statusColors[booking.status]}`}
        >
          <StatusIcon className="w-3 h-3" />
          <span className="capitalize">{booking.status}</span>
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(booking.start_date).toLocaleDateString()} -{' '}
            {new Date(booking.end_date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>Pickup: {booking.pickup_address}</span>
        </div>
        {booking.destination_address && (
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Destination: {booking.destination_address}</span>
          </div>
        )}
        
        {booking.status === 'cancelled' && booking.cancellation_reason && (
          <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
            <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">Feedback from Provider:</p>
            <p className="text-sm text-red-600 dark:text-red-400">{booking.cancellation_reason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ৳{Number(booking.total_price).toLocaleString()}
          </span>
        </div>

        {booking.status === 'pending' && (
          <div className="pt-4">
            {!showCancelConfirm ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel Request
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setShowCancelConfirm(false)}>No, Keep</Button>
                <Button variant="primary" size="sm" className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => onCancel(booking.id)}>Yes, Cancel</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, refreshProfile, isAuthenticated, isLoading } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings')

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }
    
    // Route to role-specific dashboards
    if (user) {
      if (user.role === 'driver') {
        router.push('/dashboard/driver')
        return
      }
      if (user.role === 'tour_guide') {
        router.push('/dashboard/tour-guide')
        return
      }
      if (user.role === 'car_owner') {
        router.push('/dashboard/car-owner')
        return
      }
      if (user.role === 'hotel_owner') {
        router.push('/dashboard/hotel-owner')
        return
      }
      if (user.role === 'admin') {
        router.push('/dashboard/admin')
        return
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    // Refresh profile to get latest NID and license status
    if (isAuthenticated) {
      refreshProfile()
    }
  }, [isAuthenticated])

  useEffect(() => {
    // Fetch user's bookings from API
    const fetchBookings = async () => {
      if (!isAuthenticated) return

      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch('http://localhost:5001/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setBookings(data.data || [])
        } else {
          console.error('Failed to fetch bookings')
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setBookingsLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated])

  const handleCancelBooking = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cancellation_reason: 'Cancelled by traveler' })
      })
      if (response.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to cancel booking')
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  // Show loading state while checking authentication
  if (isLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user.name}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-4 font-medium smooth-transition ${
              activeTab === 'bookings'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-4 font-medium smooth-transition ${
              activeTab === 'profile'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' ? (
          <div>
            {bookings.length === 0 ? (
              <EmptyState
                icon={<Calendar className="w-16 h-16" />}
                title="No bookings yet"
                description="Start by booking a vehicle, hotel, driver, or tour guide"
                action={
                  <div className="flex flex-wrap gap-4">
                    <Button onClick={() => window.location.href = '/vehicles'}>
                      Rent a Car
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/hotels'}>
                      Book a Hotel
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/drivers'}>
                      Hire Driver
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/tour-guides'}>
                      Hire Tour Guide
                    </Button>
                  </div>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onCancel={handleCancelBooking} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Profile Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{user.phone || 'Not provided'}</p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        NID Card
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.nidCard ? (
                          <span className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span>
                              {user.nidCard.verified
                                ? `Verified - ${user.nidCard.number}`
                                : `Submitted - ${user.nidCard.number}`}
                            </span>
                          </span>
                        ) : (
                          'Not uploaded'
                        )}
                      </p>
                    </div>
                    {user.nidCard && (
                      <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium">NID Uploaded</span>
                      </div>
                    )}
                  </div>
                  {!user.nidCard && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">Upload NID when booking a hotel</p>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        Driving License
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.drivingLicense ? (
                          <span className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span>
                              {user.drivingLicense.verified
                                ? 'Verified'
                                : 'Submitted'}
                            </span>
                          </span>
                        ) : (
                          'Not uploaded'
                        )}
                      </p>
                    </div>
                    {user.drivingLicense && (
                      <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium">License Uploaded</span>
                      </div>
                    )}
                  </div>
                  {!user.drivingLicense && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">Upload license when booking a vehicle without driver</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
