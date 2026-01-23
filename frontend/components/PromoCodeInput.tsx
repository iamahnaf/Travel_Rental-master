'use client'

import { useState } from 'react'
import { PromoCode, validatePromoCode } from '@/lib/promoCodes'
import { CheckCircle, XCircle, Tag } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface PromoCodeInputProps {
  subtotal: number
  onApply: (promoCode: PromoCode | null) => void
  appliedCode?: PromoCode | null
}

export function PromoCodeInput({ subtotal, onApply, appliedCode }: PromoCodeInputProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApply = () => {
    if (!code.trim()) {
      setError('Please enter a promo code')
      return
    }

    setLoading(true)
    setError('')

    // Simulate validation
    setTimeout(() => {
      const validation = validatePromoCode(code, subtotal)
      setLoading(false)

      if (validation.valid && validation.promoCode) {
        onApply(validation.promoCode)
        setCode('')
        setError('')
      } else {
        setError(validation.error || 'Invalid promo code')
        onApply(null)
      }
    }, 300)
  }

  const handleRemove = () => {
    onApply(null)
    setCode('')
    setError('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Promo Code
      </label>
      {appliedCode ? (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                {appliedCode.code} Applied
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {appliedCode.description}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Enter promo code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setError('')
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApply()
                }
              }}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            variant="outline"
          >
            {loading ? 'Applying...' : 'Apply'}
          </Button>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
          <XCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
