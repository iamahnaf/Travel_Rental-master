'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { CheckCircle, Users, Car, MapPin, Shield, UserCircle, Briefcase } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
}

export default function RegisterPage() {
  const router = useRouter()
  const [regPath, setRegPath] = useState<'traveler' | 'business' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'traveler' as 'traveler' | 'driver' | 'tour_guide' | 'car_owner' | 'hotel_owner' | 'admin',
    // Business specific fields
    businessName: '', // For hotels/cars
    city: '',
    address: '',
    experienceYears: '',
    specialties: '',
    carBrand: '',
    carModel: '',
    carYear: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (formData.phone && !/^\+?[\d-\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10-15 digits'
    }

    // Business validation
    if (regPath === 'business') {
      if (formData.role === 'hotel_owner') {
        if (!formData.businessName) newErrors.businessName = 'Hotel name is required'
        if (!formData.city) newErrors.city = 'City is required'
        if (!formData.address) newErrors.address = 'Address is required'
      } else if (formData.role === 'car_owner') {
        if (!formData.carBrand) newErrors.carBrand = 'Brand is required'
        if (!formData.carModel) newErrors.carModel = 'Model is required'
        if (!formData.carYear) newErrors.carYear = 'Year is required'
      } else if (formData.role === 'driver') {
        if (!formData.experienceYears) newErrors.experienceYears = 'Experience is required'
        if (!formData.city) newErrors.city = 'City is required'
      } else if (formData.role === 'tour_guide') {
        if (!formData.specialties) newErrors.specialties = 'Specialties are required'
        if (!formData.city) newErrors.city = 'City is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // Prepare user data, only include phone if it's provided
      const userData: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        // Business data
        businessData: regPath === 'business' ? {
          businessName: formData.businessName,
          city: formData.city,
          address: formData.address,
          experienceYears: formData.experienceYears,
          specialties: formData.specialties,
          carBrand: formData.carBrand,
          carModel: formData.carModel,
          carYear: formData.carYear,
        } : null
      };
      
      if (formData.phone.trim()) {
        userData.phone = formData.phone;
      }
      
      await register(userData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Registration failed:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Card className="max-w-md w-full text-center">
            <motion.div 
              className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </motion.div>
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Registration Successful!
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Redirecting to dashboard...
            </motion.p>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!regPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-2xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 dark:text-gray-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Create an Account
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Choose how you want to use the platform
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.button
              onClick={() => {
                setRegPath('traveler');
                setFormData({ ...formData, role: 'traveler' });
              }}
              className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-transparent hover:border-primary-500 shadow-xl text-center"
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div 
                className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <UserCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Traveler</h3>
              <p className="text-gray-600 dark:text-gray-400">
                I want to book cars, hotels, and tours.
              </p>
            </motion.button>

            <motion.button
              onClick={() => {
                setRegPath('business');
                setFormData({ ...formData, role: 'driver' });
              }}
              className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-transparent hover:border-blue-500 shadow-xl text-center"
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div 
                className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.15, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Business</h3>
              <p className="text-gray-600 dark:text-gray-400">
                I want to offer my services or list properties.
              </p>
            </motion.button>
          </div>

          <motion.p 
            className="mt-12 text-center text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary-600 dark:text-primary-400 hover:underline font-bold"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          onClick={() => setRegPath(null)}
          className="mb-8 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 flex items-center"
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
        >
          ← Back to selection
        </motion.button>

        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {regPath === 'traveler' ? 'Traveler Registration' : 'Business Registration'}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {regPath === 'business' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Business Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'driver' })}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.role === 'driver'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-xs font-medium">Driver</div>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'tour_guide' })}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.role === 'tour_guide'
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-xs font-medium">Tour Guide</div>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'car_owner' })}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.role === 'car_owner'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-xs font-medium">Car Owner</div>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'hotel_owner' })}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      formData.role === 'hotel_owner'
                        ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-xs font-medium">Hotel Owner</div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {regPath === 'business' && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  {formData.role === 'car_owner' ? 'Car' : formData.role === 'hotel_owner' ? 'Hotel' : formData.role.replace('_', ' ')} Details
                </h3>
                
                {formData.role === 'hotel_owner' && (
                  <>
                    <Input
                      label="Hotel Name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      error={errors.businessName}
                      placeholder="Grand Plaza Hotel"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        error={errors.city}
                        placeholder="Dhaka"
                      />
                      <Input
                        label="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        error={errors.address}
                        placeholder="123 Street Name"
                      />
                    </div>
                  </>
                )}

                {formData.role === 'car_owner' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Car Brand"
                        value={formData.carBrand}
                        onChange={(e) => setFormData({ ...formData, carBrand: e.target.value })}
                        error={errors.carBrand}
                        placeholder="Toyota"
                      />
                      <Input
                        label="Model"
                        value={formData.carModel}
                        onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                        error={errors.carModel}
                        placeholder="Corolla"
                      />
                    </div>
                    <Input
                      label="Year"
                      type="number"
                      value={formData.carYear}
                      onChange={(e) => setFormData({ ...formData, carYear: e.target.value })}
                      error={errors.carYear}
                      placeholder="2022"
                    />
                  </>
                )}

                {formData.role === 'driver' && (
                  <>
                    <Input
                      label="Years of Experience"
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      error={errors.experienceYears}
                      placeholder="5"
                    />
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      error={errors.city}
                      placeholder="Dhaka"
                    />
                  </>
                )}

                {formData.role === 'tour_guide' && (
                  <>
                    <Input
                      label="Specialties (comma separated)"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      error={errors.specialties}
                      placeholder="History, Nature, Food"
                    />
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      error={errors.city}
                      placeholder="Cox's Bazar"
                    />
                  </>
                )}
              </div>
            )}

            <div>
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Input
                label="Email address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Input
                label="Phone Number (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                placeholder="1234567890"
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                placeholder="••••••••"
              />
            </div>

            <div>
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                placeholder="••••••••"
              />
            </div>

{errors.submit && (
              <div className="text-red-500 text-sm mb-4">
                {errors.submit}
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
