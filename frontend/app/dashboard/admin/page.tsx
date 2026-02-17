'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Users, Car, Building2, MapPin, UserCheck, Calendar, 
  DollarSign, TrendingUp, LogOut, Eye, CheckCircle, XCircle,
  Clock, Shield, BarChart3, Trash2
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalVehicles: number
  totalHotels: number
  totalDrivers: number
  totalTourGuides: number
  totalBookings: number
  pendingBookings: number
  totalRevenue: number
  pendingNIDs: number
  pendingLicenses: number
}

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  created_at: string
}

interface Booking {
  id: number
  user_name: string
  booking_type: string
  status: string
  total_price: number
  start_date: string
  end_date: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'vehicles' | 'hotels' | 'verifications'>('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalVehicles: 0, totalHotels: 0, totalDrivers: 0,
    totalTourGuides: 0, totalBookings: 0, pendingBookings: 0, 
    totalRevenue: 0, pendingNIDs: 0, pendingLicenses: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [hotels, setHotels] = useState<any[]>([])
  const [nids, setNids] = useState<any[]>([])
  const [licenses, setLicenses] = useState<any[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<{type: string, id: number} | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAllData()
    }
  }, [isAuthenticated, user])

  const fetchAllData = async () => {
    const token = localStorage.getItem('token')
    const headers = { 'Authorization': `Bearer ${token}` }

    try {
      // Fetch stats
      const [usersRes, vehiclesRes, hotelsRes, bookingsRes, driversRes, tourGuidesRes, nidsRes, licensesRes] = await Promise.all([
        fetch('http://localhost:5001/api/users', { headers }).catch(() => null),
        fetch('http://localhost:5001/api/vehicles', { headers }).catch(() => null),
        fetch('http://localhost:5001/api/hotels', { headers }).catch(() => null),
        fetch('http://localhost:5001/api/bookings/all', { headers }).catch(() => null),
        fetch('http://localhost:5001/api/drivers', { headers }).catch(() => null),
        fetch('http://localhost:5001/api/tour-guides', { headers }).catch(() => null),
        fetch('http://localhost:5001/api/nids/pending', { headers }).catch(() => null),
        fetch('http://localhost:5001/api/licenses/pending', { headers }).catch(() => null),
      ])

      let usersData: any[] = []
      let vehiclesData: any[] = []
      let hotelsData: any[] = []
      let bookingsData: any[] = []
      let driversData: any[] = []
      let tourGuidesData: any[] = []
      let nidsData: any[] = []
      let licensesData: any[] = []

      if (usersRes?.ok) {
        const data = await usersRes.json()
        usersData = data.data || []
        setUsers(usersData)
      }
      if (vehiclesRes?.ok) {
        const data = await vehiclesRes.json()
        vehiclesData = data.data || []
        setVehicles(vehiclesData)
      }
      if (hotelsRes?.ok) {
        const data = await hotelsRes.json()
        hotelsData = data.data || []
        setHotels(hotelsData)
      }
      if (bookingsRes?.ok) {
        const data = await bookingsRes.json()
        bookingsData = data.data || []
        setBookings(bookingsData)
      }
      if (driversRes?.ok) {
        const data = await driversRes.json()
        driversData = data.data || []
      }
      if (tourGuidesRes?.ok) {
        const data = await tourGuidesRes.json()
        tourGuidesData = data.data || []
      }
      if (nidsRes?.ok) {
        const data = await nidsRes.json()
        nidsData = data.data || []
        setNids(nidsData)
      }
      if (licensesRes?.ok) {
        const data = await licensesRes.json()
        licensesData = data.data || []
        setLicenses(licensesData)
      }

      // Calculate stats
      const pendingBookings = bookingsData.filter((b: any) => b.status === 'pending').length
      const totalRevenue = bookingsData
        .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum: number, b: any) => sum + Number(b.total_price || 0), 0)

      setStats({
        totalUsers: usersData.length,
        totalVehicles: vehiclesData.length,
        totalHotels: hotelsData.length,
        totalDrivers: driversData.length,
        totalTourGuides: tourGuidesData.length,
        totalBookings: bookingsData.length,
        pendingBookings,
        totalRevenue,
        pendingNIDs: nidsData.length,
        pendingLicenses: licensesData.length
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveNID = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/nids/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
      })
      if (response.ok) {
        setNids(nids.filter(n => n.id !== id))
        setStats(prev => ({ ...prev, pendingNIDs: prev.pendingNIDs - 1 }))
      }
    } catch (error) {
      console.error('Error approving NID:', error)
    }
  }

  const handleRejectNID = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/nids/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
      })
      if (response.ok) {
        setNids(nids.filter(n => n.id !== id))
        setStats(prev => ({ ...prev, pendingNIDs: prev.pendingNIDs - 1 }))
      }
    } catch (error) {
      console.error('Error rejecting NID:', error)
    }
  }

  const handleApproveLicense = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/licenses/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
      })
      if (response.ok) {
        setLicenses(licenses.filter(l => l.id !== id))
        setStats(prev => ({ ...prev, pendingLicenses: prev.pendingLicenses - 1 }))
      }
    } catch (error) {
      console.error('Error approving license:', error)
    }
  }

  const handleRejectLicense = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/licenses/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
      })
      if (response.ok) {
        setLicenses(licenses.filter(l => l.id !== id))
        setStats(prev => ({ ...prev, pendingLicenses: prev.pendingLicenses - 1 }))
      }
    } catch (error) {
      console.error('Error rejecting license:', error)
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id))
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }))
        setDeleteConfirm(null)
        showToast('User deleted successfully', 'success')
      } else {
        showToast(data.message || 'Failed to delete user', 'error')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      showToast('Error deleting user', 'error')
    }
  }

  const handleDeleteVehicle = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setVehicles(vehicles.filter(v => v.id !== id))
        setStats(prev => ({ ...prev, totalVehicles: prev.totalVehicles - 1 }))
        setDeleteConfirm(null)
        showToast('Vehicle deleted successfully', 'success')
      } else {
        showToast(data.message || 'Failed to delete vehicle', 'error')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      showToast('Error deleting vehicle', 'error')
    }
  }

  const handleDeleteHotel = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/hotels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setHotels(hotels.filter(h => h.id !== id))
        setStats(prev => ({ ...prev, totalHotels: prev.totalHotels - 1 }))
        setDeleteConfirm(null)
        showToast('Hotel deleted successfully', 'success')
      } else {
        showToast(data.message || 'Failed to delete hotel', 'error')
      }
    } catch (error) {
      console.error('Error deleting hotel:', error)
      showToast('Error deleting hotel', 'error')
    }
  }

  const handleDeleteBooking = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== id))
        setStats(prev => ({ ...prev, totalBookings: prev.totalBookings - 1 }))
        setDeleteConfirm(null)
        showToast('Booking deleted successfully', 'success')
      } else {
        showToast(data.message || 'Failed to delete booking', 'error')
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      showToast('Error deleting booking', 'error')
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome, {user.name} — Manage everything from here
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'bookings', label: 'Bookings', icon: Calendar },
            { key: 'vehicles', label: 'Vehicles', icon: Car },
            { key: 'hotels', label: 'Hotels', icon: Building2 },
            { key: 'verifications', label: 'Verifications', icon: UserCheck },
          ].map(tab => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'primary' : 'outline'}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.key === 'verifications' && (stats.pendingNIDs + stats.pendingLicenses) > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {stats.pendingNIDs + stats.pendingLicenses}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalBookings}</p>
                    <p className="text-xs text-yellow-600">{stats.pendingBookings} pending</p>
                  </div>
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">৳{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Verifications</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingNIDs + stats.pendingLicenses}</p>
                  </div>
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Car className="w-8 h-8 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalVehicles}</p>
                    <p className="text-xs text-gray-500">Vehicles</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalHotels}</p>
                    <p className="text-xs text-gray-500">Hotels</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-teal-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalDrivers}</p>
                    <p className="text-xs text-gray-500">Drivers</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-pink-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalTourGuides}</p>
                    <p className="text-xs text-gray-500">Tour Guides</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-4 font-semibold">ID</th>
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Phone</th>
                    <th className="text-left p-4 font-semibold">Role</th>
                    <th className="text-left p-4 font-semibold">Joined</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">{u.id}</td>
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="p-4">{u.phone || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-red-100 text-red-700' :
                          u.role === 'traveler' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {u.id !== user?.id && (
                          deleteConfirm?.type === 'user' && deleteConfirm?.id === u.id ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleDeleteUser(u.id)}
                                className="bg-red-600 hover:bg-red-700 text-xs"
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm({type: 'user', id: u.id})}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-center py-8 text-gray-500">No users found</p>
              )}
            </div>
          </Card>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-4 font-semibold">ID</th>
                    <th className="text-left p-4 font-semibold">Customer</th>
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Dates</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">{b.id}</td>
                      <td className="p-4 font-medium">{b.user_name || 'N/A'}</td>
                      <td className="p-4 capitalize">{b.booking_type}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium">৳{Number(b.total_price).toLocaleString()}</td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {deleteConfirm?.type === 'booking' && deleteConfirm?.id === b.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDeleteBooking(b.id)}
                              className="bg-red-600 hover:bg-red-700 text-xs"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm({type: 'booking', id: b.id})}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <p className="text-center py-8 text-gray-500">No bookings found</p>
              )}
            </div>
          </Card>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-4 font-semibold">ID</th>
                    <th className="text-left p-4 font-semibold">Vehicle</th>
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-left p-4 font-semibold">Owner</th>
                    <th className="text-left p-4 font-semibold">Price/Day</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => (
                    <tr key={v.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">{v.id}</td>
                      <td className="p-4 font-medium">{v.brand} {v.model} ({v.year})</td>
                      <td className="p-4 capitalize">{v.type}</td>
                      <td className="p-4">{v.owner_name || 'N/A'}</td>
                      <td className="p-4">৳{Number(v.price_per_day).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          v.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {v.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="p-4">
                        {deleteConfirm?.type === 'vehicle' && deleteConfirm?.id === v.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="bg-red-600 hover:bg-red-700 text-xs"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm({type: 'vehicle', id: v.id})}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vehicles.length === 0 && (
                <p className="text-center py-8 text-gray-500">No vehicles found</p>
              )}
            </div>
          </Card>
        )}

        {/* Hotels Tab */}
        {activeTab === 'hotels' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-4 font-semibold">ID</th>
                    <th className="text-left p-4 font-semibold">Hotel</th>
                    <th className="text-left p-4 font-semibold">City</th>
                    <th className="text-left p-4 font-semibold">Owner</th>
                    <th className="text-left p-4 font-semibold">Price/Night</th>
                    <th className="text-left p-4 font-semibold">Rooms</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map(h => (
                    <tr key={h.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">{h.id}</td>
                      <td className="p-4 font-medium">{h.name}</td>
                      <td className="p-4">{h.city}</td>
                      <td className="p-4">{h.owner_name || 'N/A'}</td>
                      <td className="p-4">৳{Number(h.price_per_night).toLocaleString()}</td>
                      <td className="p-4">{h.available_rooms} available</td>
                      <td className="p-4">
                        {deleteConfirm?.type === 'hotel' && deleteConfirm?.id === h.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDeleteHotel(h.id)}
                              className="bg-red-600 hover:bg-red-700 text-xs"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm({type: 'hotel', id: h.id})}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hotels.length === 0 && (
                <p className="text-center py-8 text-gray-500">No hotels found</p>
              )}
            </div>
          </Card>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="space-y-8">
            {/* Pending NIDs */}
            <Card>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Pending NID Verifications ({nids.length})
              </h3>
              {nids.length > 0 ? (
                <div className="space-y-4">
                  {nids.map(nid => (
                    <div key={nid.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium">{nid.user_name || 'User #' + nid.user_id}</p>
                        <p className="text-sm text-gray-500">NID: {nid.nid_number}</p>
                        <a href={nid.front_image_url} target="_blank" className="text-sm text-primary-600 hover:underline">
                          View Document
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApproveNID(nid.id)} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectNID(nid.id)} className="text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No pending NID verifications</p>
              )}
            </Card>

            {/* Pending Licenses */}
            <Card>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Pending License Verifications ({licenses.length})
              </h3>
              {licenses.length > 0 ? (
                <div className="space-y-4">
                  {licenses.map(license => (
                    <div key={license.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium">{license.user_name || 'User #' + license.user_id}</p>
                        <p className="text-sm text-gray-500">License: {license.license_number}</p>
                        <a href={license.front_image_url} target="_blank" className="text-sm text-primary-600 hover:underline">
                          View Document
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApproveLicense(license.id)} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectLicense(license.id)} className="text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No pending license verifications</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
