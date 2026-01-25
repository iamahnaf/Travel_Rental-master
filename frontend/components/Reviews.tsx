'use client'

import { Review } from '@/types'
import { Star, User } from 'lucide-react'
import { Card } from './ui/Card'

interface ReviewsProps {
  reviews: (Review | any)[]
}

export function Reviews({ reviews }: ReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No reviews yet</p>
          <p className="text-sm">Be the first to share your experience!</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Reviews ({reviews.length})
      </h3>
      {reviews.map((review) => {
        // Handle both camelCase (mock) and snake_case (API) formats
        const userName = review.userName || review.user_name || 'Anonymous'
        const reviewDate = review.date || review.created_at
        
        return (
          <Card key={review.id}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                {review.userAvatar ? (
                  <img
                    src={review.userAvatar}
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {userName}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(review.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {reviewDate ? new Date(reviewDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : ''}
                </p>
                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
