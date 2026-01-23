'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/FileUpload'
import { EmptyState } from '@/components/ui/EmptyState'
import { Calendar, DollarSign, MapPin, Star, LogOut, Bell, Edit, Save, X } from 'lucide-react'
import { IncomingRequests } from '@/components/IncomingRequests'

export default function TourGuideDashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalTours: 0,
    rating: 0,
    upcomingTours: 0
  })
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState<any>({
    name: '', experience_years: 0, city: '', location: '', bio: '', price_per_day: 0, languages: [], specialties: [], available: true, photo_url: ''
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
    if (user && user.role !== 'tour_guide') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, user, router])

  const fetchTourGuideData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/tour-guides/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
        setFormData({
          ...data.data,
          languages: typeof data.data.languages === 'string' ? JSON.parse(data.data.languages) : data.data.languages || [],
          specialties: typeof data.data.specialties === 'string' ? JSON.parse(data.data.specialties) : data.data.specialties || []
        })
        setStats({
          totalEarnings: data.data.total_tours * data.data.price_per_day * 0.85,
          totalTours: data.data.total_tours,
          rating: Number(data.data.rating),
          upcomingTours: 3
        })
      }
    } catch (error) {
      console.error('Error fetching tour guide data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTourGuideData()
    }
  }, [isAuthenticated])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/tour-guides/profile/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        setIsEditing(false)
        fetchTourGuideData()
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

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
                Tour Guide Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user.name}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </Button>
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
        </div>

        {isEditing && (
          <Card className="mb-8 p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input required className="w-full border rounded p-2" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                <input type="number" required className="w-full border rounded p-2" value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price per Day ($)</label>
                <input type="number" required className="w-full border rounded p-2" value={formData.price_per_day} onChange={e => setFormData({...formData, price_per_day: Number(e.target.value)})} />
              </div>
              <div className="col-span-2">
                <FileUpload
                  label="Profile Photo"
                  endpoint="/api/uploads/tour-guide/profile-photo"
                  currentUrl={formData.photo_url || null}
                  onUpload={(url) => setFormData({...formData, photo_url: url})}
                  maxSize={5}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Specialties (comma separated)</label>
                <input className="w-full border rounded p-2" value={formData.specialties.join(', ')} onChange={e => setFormData({...formData, specialties: e.target.value.split(',').map(s => s.trim())})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea className="w-full border rounded p-2" rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ৳{stats.totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalTours}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.rating.toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Tours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.upcomingTours}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-600" />
            Incoming Requests
          </h2>
          <IncomingRequests />
        </div>
      </div>
    </div>
  )
}
