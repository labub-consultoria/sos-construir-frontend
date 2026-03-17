import type {
  BaseSection,
  WorkGallerySection,
  ProcessSection,
  FinalCtaSection,
  FAQSection,
  WhyChooseUsSection,
  Tag,
} from '~~/shared/types/sections'
import type { Meta } from '~~/shared/types/meta'

interface Cta {
  link: string
  text: string
  icon?: string
}
interface Feature {
  text: string
  icon: string
}
export interface ServiceHeroSection extends BaseSection {
  image: string
  primaryCta?: Cta
  secondaryCta?: Cta
  features?: Feature[]
}

export interface PartnerSection extends BaseSection {
  partnerName: string
  logo: string
  description: string
  tags: Tag[]
  cta: Cta
  footerInfo: {
    usage: string
    guarantee: string
  }
  coverImage: string
}

export interface ServicePartnerSection extends BaseSection {
  partnerName: string
  logo: string
  tags: string[]
  cta: string
  footerInfo: { usage: string; guarantee: string }
}

export interface ServiceSections {
  hero: ServiceHeroSection
  partner?: PartnerSection
  workGallery: WorkGallerySection
  process: ProcessSection
  professionals: BaseSection
  whyChooseUs?: WhyChooseUsSection
  faq?: FAQSection
  testimonials?: BaseSection
  finalCta?: FinalCtaSection
}

export interface ServicePage {
  meta: Meta
  sections: ServiceSections
}

export type SectionKey = keyof ServiceSections
