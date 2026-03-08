export interface ProjectWork {
  id: number | string
  type: 'classic' | 'before-after'
  imageUrl: string
  beforeImageUrl?: string
  aspectRatio?: string
  title?: string
  author?: string
  tag?: string
  categories?: string[]
}
