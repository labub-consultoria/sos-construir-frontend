/**
 * Meta information for SEO
 */
export interface ServiceMeta {
  title: string
  description: string
  keywords: string
  ogImage: string
  breadcrumbLabel: string
}

/**
 * Hero section content
 */
export interface HeroSection {
  title: string
  subtitle: string
  image: string
}

/**
 * What we do - differential/feature
 */
export interface Differential {
  icon: string
  title: string
  description: string
}

/**
 * What we do section
 */
export interface WhatWeDoSection {
  differentials: Differential[]
}

/**
 * Partner information
 */
export interface Partner {
  name: string
  logo: string
}

/**
 * Partner section
 */
export interface PartnerSection {
  partnerName: string
  logo: string
  subtitle: string
  tags: string[]
  cta: string
  footerInfo: {
    usage: string
    guarantee: string
  }
}

/**
 * Work gallery section
 */
export interface WorkGallerySection {
  filters: string[]
}

/**
 * Process step
 */
export interface ProcessStep {
  step: number
  title: string
  description: string
  icon: string
}

/**
 * Process section
 */
export interface ProcessSection {
  steps: ProcessStep[]
}

/**
 * Professionals section
 */
export interface ProfessionalsSection {
  title: string
  subtitle: string
}

/**
 * FAQ Question
 */
export interface FAQQuestion {
  question: string
  answer: string
}

/**
 * FAQ section
 */
export interface FAQSection {
  title: string
  questions: FAQQuestion[]
}

/**
 * All sections combined
 */
export interface ServiceSections {
  hero: HeroSection
  whatWeDo: WhatWeDoSection
  partner: PartnerSection
  workGallery: WorkGallerySection
  process: ProcessSection
  professionals: ProfessionalsSection
  faq: FAQSection
}

/**
 * Complete Service
 */
export interface Service {
  meta: ServiceMeta
  sections: ServiceSections
}

/**
 * Services data (key-value map)
 */
export interface ServicesData {
  [key: string]: Service
}
