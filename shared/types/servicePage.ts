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
  image?: string // explícito (ex.: /sobre); nas páginas de serviço é derivado do slug
  primaryCta?: Cta
  secondaryCta?: Cta
  features?: Feature[]
}

export interface OverviewStat {
  icon: string
  value: string
  label: string
}

export interface OverviewSection extends BaseSection {
  imageAlt?: string
  paragraphs: string[]
  stats?: OverviewStat[]
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

// Locação não tem equipe própria nem obra para fotografar, então `professionals` e `workGallery`
// ficam de fora dessas páginas.
export interface ServiceSections {
  hero: ServiceHeroSection
  overview?: OverviewSection
  partner?: PartnerSection
  workGallery?: WorkGallerySection
  process: ProcessSection
  professionals?: BaseSection
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
