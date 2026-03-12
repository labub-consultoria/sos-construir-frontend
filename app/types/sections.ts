export interface BaseSection {
  kicker?: string
  title?: string
  description?: string
  bgSection?: string
}
export interface Tag {
  icon: string
  text: string
}

export interface FAQQuestion {
  question: string
  answer: string
}
export interface FAQSection extends BaseSection {
  questions: FAQQuestion[]
}

export interface ProcessStep {
  step: number
  title: string
  description: string
  icon: string
}
export interface ProcessSection extends BaseSection {
  steps: ProcessStep[]
}

export interface ReasonCard {
  icon: string
  title: string
  description: string
}
export interface WhyChooseUsSection extends BaseSection {
  stats?: { icon: string; text: string }[]
  reasons?: ReasonCard[]
  ctaText?: string
  ctaLink?: string
}

export interface CtaSection extends BaseSection {
  buttonText?: string
  buttonIcon?: string
  buttonLink?: string
}
export interface WorkGalleryFilter {
  label: string
  slug: string
  count: number
}
export interface WorkGallerySection extends BaseSection {
  filters: WorkGalleryFilter[]
}

export interface FinalCtaSection extends BaseSection {
  buttonIcon?: string
  buttonText?: string
  buttonLink?: string
}

interface Partner {
  id: number
  name: string
  logo: string
  link: string
}

export interface PartnersSection extends BaseSection {
  kicker?: string
  ctaText?: string
  ctaLink?: string
  tags: Tag[]
  partners: Partner[]
}

export interface SolutionCard {
  id: number | string
  type: 'image' | 'standard'
  size?: 'large' | 'medium'
  title: string
  description: string
  icon: string
  image?: string
  link?: string
}

export interface SolutionsSection extends BaseSection {
  kicker?: string
  ctaText?: string
  ctaLink?: string
  cards?: SolutionCard[]
}
