export interface Service {
  id: number | string
  name: string
  slug: string
  category: string
  size?: 'large' | 'medium'
  icon: string
  image: string
  description: string
  keywords: string[]
  popularity: number
}
