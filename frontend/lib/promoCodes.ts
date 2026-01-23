export interface PromoCode {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minAmount?: number
  maxDiscount?: number
  validUntil?: string
  description: string
}

export const promoCodes: PromoCode[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minAmount: 2000,
    description: '10% off on bookings above ৳2,000',
  },
  {
    code: 'SAVE500',
    discountType: 'fixed',
    discountValue: 500,
    minAmount: 3000,
    description: '৳500 off on bookings above ৳3,000',
  },
  {
    code: 'SUMMER20',
    discountType: 'percentage',
    discountValue: 20,
    minAmount: 5000,
    maxDiscount: 2000,
    description: '20% off (max ৳2,000) on bookings above ৳5,000',
  },
  {
    code: 'FIRST50',
    discountType: 'fixed',
    discountValue: 50,
    minAmount: 500,
    description: '৳50 off on your first booking',
  },
  {
    code: 'WEEKEND15',
    discountType: 'percentage',
    discountValue: 15,
    minAmount: 2500,
    description: '15% off on weekend bookings above ৳2,500',
  },
]

export function validatePromoCode(code: string, subtotal: number): { valid: boolean; promoCode?: PromoCode; error?: string } {
  const promoCode = promoCodes.find(
    (pc) => pc.code.toUpperCase() === code.toUpperCase()
  )

  if (!promoCode) {
    return { valid: false, error: 'Invalid promo code' }
  }

  if (promoCode.validUntil && new Date(promoCode.validUntil) < new Date()) {
    return { valid: false, error: 'Promo code has expired' }
  }

  if (promoCode.minAmount && subtotal < promoCode.minAmount) {
    return {
      valid: false,
      error: `Minimum booking amount of ৳${promoCode.minAmount.toLocaleString()} required`,
    }
  }

  return { valid: true, promoCode }
}

export function calculateDiscount(
  promoCode: PromoCode,
  subtotal: number
): number {
  let discount = 0

  if (promoCode.discountType === 'percentage') {
    discount = (subtotal * promoCode.discountValue) / 100
    if (promoCode.maxDiscount) {
      discount = Math.min(discount, promoCode.maxDiscount)
    }
  } else {
    discount = promoCode.discountValue
  }

  return Math.min(discount, subtotal)
}
