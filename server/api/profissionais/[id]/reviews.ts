import type { Review } from '~~/shared/types/review'
import reviewsData from '~/data/reviews.json'

const reviews = reviewsData as Review[]

export default defineEventHandler((event): Review[] => {
  const id = getRouterParam(event, 'id')
  return reviews.filter((r) => r.professionalId === id)
})
