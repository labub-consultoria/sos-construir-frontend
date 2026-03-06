export default interface Professional {
  id: string | number
  name: string
  experience: string
  rating: number
  reviews: number
  jobsCompleted: string
  satisfaction: string
  avatar: string
  isTopRated?: boolean
  verifications: { text: string, type: 'success' | 'warning' }[]
  specialties: string[]
  portfolio: string[]
}
