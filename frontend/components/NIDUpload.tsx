'use client'

import { useState } from 'react'
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface NIDUploadProps {
  onClose: () => void
  onComplete: (nidData: { number: string; file: File }) => void
}

export function NIDUpload({ onClose, onComplete }: NIDUploadProps) {
  const [nidNumber, setNidNumber] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ number?: string; file?: string }>({})
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setErrors({ ...errors, file: 'Please upload an image file' })
        return
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: 'File size must be less than 5MB' })
        return
      }

      setFile(selectedFile)
      setErrors({ ...errors, file: undefined })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const validate = () => {
    const newErrors: { number?: string; file?: string } = {}

    // Validate NID number (Bangladeshi NID is typically 10, 13, or 17 digits)
    if (!nidNumber) {
      newErrors.number = 'NID number is required'
    } else if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(nidNumber)) {
      newErrors.number = 'Invalid NID number format (should be 10, 13, or 17 digits)'
    }

    if (!file) {
      newErrors.file = 'Please upload your NID card image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !file) return

    setUploading(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setErrors({ ...errors, file: 'Please login to upload NID' })
        setUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('nid', file)
      formData.append('number', nidNumber)

      const response = await fetch('http://localhost:5001/api/nids/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onComplete({ number: nidNumber, file })
      } else {
        setErrors({ ...errors, file: data.message || 'Upload failed. Please try again.' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setErrors({ ...errors, file: 'An error occurred while uploading' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Upload NID Card
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Required for hotel booking verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg smooth-transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Information Card */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-1">Why do we need your NID?</p>
                  <p>Your National ID card is required for identity verification when booking hotels. Your information is kept secure and confidential.</p>
                </div>
              </div>
            </Card>

            {/* NID Number Input */}
            <div>
              <Input
                label="NID Number"
                type="text"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your NID number"
                error={errors.number}
                maxLength={17}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter 10, 13, or 17 digit NID number
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                NID Card Image
              </label>
              
              {!preview ? (
                <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 smooth-transition">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt="NID Preview"
                    className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      setPreview(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 smooth-transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Image uploaded</span>
                  </div>
                </div>
              )}
              
              {errors.file && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I confirm that the information provided is accurate and I consent to the processing of my personal data for booking verification purposes.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  'Upload & Continue'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
