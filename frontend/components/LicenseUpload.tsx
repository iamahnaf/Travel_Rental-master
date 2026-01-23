'use client'

import { useState } from 'react'
import { X, Upload, Check, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'

interface LicenseUploadProps {
  onClose: () => void
  onComplete: () => void
}

export function LicenseUpload({ onClose, onComplete }: LicenseUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      setError('')
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login to upload license')
        setUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('license', file)

      const response = await fetch('http://localhost:5001/api/licenses/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploaded(true)
        // Wait a moment to show success message, then complete
        setTimeout(() => {
          onComplete()
        }, 1500)
      } else {
        setError(data.message || 'Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('An error occurred while uploading')
    } finally {
      setUploading(false)
    }
  }

  const handleContinue = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Upload Driving License
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg smooth-transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!uploaded ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  To rent a car without a driver, please upload a valid driving license.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Supported formats: JPG, PNG, PDF (Max 5MB)
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {preview ? (
                <div className="mb-6">
                  <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                    <img
                      src={preview}
                      alt="License preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setFile(null)
                      setPreview(null)
                      setError('')
                    }}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Remove and select another file
                  </button>
                </div>
              ) : (
                <label className="block mb-6">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 smooth-transition">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      JPG, PNG, PDF up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              <div className="flex space-x-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpload} className="flex-1" disabled={!file || uploading}>
                  {uploading ? 'Uploading...' : 'Upload License'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                License Verified Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your driving license has been uploaded and automatically verified. You can now complete your booking.
              </p>
              <Button onClick={handleContinue} className="w-full">
                Continue to Booking
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
