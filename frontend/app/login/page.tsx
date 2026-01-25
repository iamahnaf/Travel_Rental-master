'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { AlertCircle, User, Briefcase, Eye, EyeOff } from 'lucide-react'
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
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loginType, setLoginType] = useState<'traveler' | 'business' | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setLoginError('')
    
    try {
      await login(formData.email, formData.password)
      router.push('/dashboard')
    } catch (error) {
      setLoginError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  if (!loginType) {
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
              Welcome Back
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Choose your login type to continue
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.button
              onClick={() => setLoginType('traveler')}
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
                <User className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Traveler</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to book cars, hotels, drivers, and tour guides.
              </p>
            </motion.button>

            <motion.button
              onClick={() => setLoginType('business')}
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
                For drivers, tour guides, car owners, and hotel owners.
              </p>
            </motion.button>
          </div>

          <motion.p 
            className="mt-12 text-center text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-primary-600 dark:text-primary-400 hover:underline font-bold"
            >
              Create a new account
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
          onClick={() => setLoginType(null)}
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
            Sign in as {loginType === 'traveler' ? 'Traveler' : 'Business'}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {loginError && (
                  <motion.div 
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  label="Email address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  placeholder="you@example.com"
                />
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                  placeholder="••••••••"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center"
                      >
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Signing in...
                      </motion.span>
                    ) : 'Sign in'}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
