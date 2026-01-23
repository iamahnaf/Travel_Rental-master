'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Calendar, MapPin, User, MessageSquare, CheckCircle, XCircle } from 'lucide-react'

interface BookingRequest {
  id: number
  traveler_name: string
  service_name: string
  booking_type: string
  pickup_address?: string
  destination_address?: string
  start_date: string
  end_date: string
  total_price: number
  status: string
  hotel_name?: string
  hotel_city?: string
  vehicle_brand?: string
  vehicle_model?: string
}

export function IncomingRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/bookings/business/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setRequests(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/bookings/${id}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: 'confirmed' } : req))
      }
    } catch (error) {
      console.error('Failed to accept booking:', error)
    }
  }

  const handleReject = async (id: number) => {
    if (!feedback) {
      alert('Please provide a reason for cancellation')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/bookings/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cancellation_reason: feedback })
      })
      const data = await response.json()
      if (data.success) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: 'cancelled' } : req))
        setRejectingId(null)
        setFeedback('')
      }
    } catch (error) {
      console.error('Failed to reject booking:', error)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      <LoadingSkeleton className="h-40 w-full" />
      <LoadingSkeleton className="h-40 w-full" />
    </div>
  )

  if (requests.length === 0) return (
    <EmptyState
      title="No requests yet"
      description="Incoming booking requests will appear here"
      icon={<Calendar className="w-12 h-12 text-gray-400" />}
    />
  )

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{request.traveler_name}</h3>
                  <p className="text-sm text-gray-500">{request.service_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  request.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {request.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</span>
                </div>
                {request.booking_type === 'hotel' && request.hotel_name && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Hotel: {request.hotel_name}{request.hotel_city ? `, ${request.hotel_city}` : ''}</span>
                  </div>
                )}
                {request.booking_type !== 'hotel' && request.pickup_address && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Pickup: {request.pickup_address}</span>
                  </div>
                )}
                {request.booking_type !== 'hotel' && request.destination_address && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Destination: {request.destination_address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center items-end space-y-3 min-w-[200px]">
              <div className="text-2xl font-bold text-primary-600">৳{request.total_price.toLocaleString()}</div>
              
              {request.status === 'pending' && (
                <div className="flex space-x-2 w-full">
                  <Button 
                    className="flex-1" 
                    variant="primary"
                    onClick={() => handleAccept(request.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => setRejectingId(request.id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>

          {rejectingId === request.id && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <MessageSquare className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Reason for cancellation</span>
              </div>
              <textarea
                className="w-full p-3 text-sm border border-red-200 dark:border-red-800 rounded-md bg-white dark:bg-gray-800"
                placeholder="E.g., Vehicle maintenance, schedule conflict..."
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="mt-3 flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setRejectingId(null)}>Cancel</Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 border-none" 
                  onClick={() => handleReject(request.id)}
                >
                  Send Feedback & Reject
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
