export interface BaseSection {
  title?: string
  description?: string
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
  stats?: { icon: string, text: string }[]
  reasons: ReasonCard[]
  ctaText?: string
  ctaLink?: string
}

export interface CtaSection extends BaseSection {
  buttonText?: string
  buttonIcon?: string
  buttonLink?: string
}

export interface WorkGallerySection extends BaseSection {
  filters: string[]
}

export interface FinalCtaSection extends BaseSection {
  buttonIcon?: string
  buttonText?: string
  buttonLink?: string
}
