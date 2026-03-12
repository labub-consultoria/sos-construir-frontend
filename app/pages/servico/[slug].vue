<script setup lang="ts">
import type { Service, SectionKey } from '~/types/servicePage'

import {
  SectionTestimonials,
  SectionServiceHero,
  SectionServicePartnerShowcase,
  SectionWorksGallery,
  SectionOurProcess,
  SectionProfessionals,
  SectionFaq,
  SectionFinalCta,
  SectionWhyChooseUs
} from '#components'

import servicesData from '~/data/servicesPages.json'

const route = useRoute()

const { data: service } = await useAsyncData<Service | null>(
  `service-${route.params.slug}`,
  async () => {
    const slug = route.params.slug as string
    const key = slug.charAt(0).toUpperCase() + slug.slice(1)

    return (servicesData as Record<string, Service>)[key] ?? null
  }
)

if (!service.value) {
  throw createError({ statusCode: 404 })
}
if (!service.value) {
  throw createError({ statusCode: 404 })
}

useSeoMeta({
  title: service.value.meta.title,
  description: service.value.meta.description,
  keywords: service.value.meta.keywords,

  ogTitle: service.value.meta.title,
  ogDescription: service.value.meta.description,
  ogImage: service.value.meta.ogImage,

  twitterTitle: service.value.meta.title,
  twitterDescription: service.value.meta.description,
  twitterImage: service.value.meta.ogImage,
  twitterCard: 'summary_large_image'
})

const layoutOrder: SectionKey[] = [
  'hero',
  'partner',
  'process',
  'professionals',
  'testimonials',
  'workGallery',
  'whyChooseUs',
  'faq',
  'finalCta'
]
const sectionComponents: Record<SectionKey, Component> = {
  hero: SectionServiceHero,
  partner: SectionServicePartnerShowcase,
  workGallery: SectionWorksGallery,
  process: SectionOurProcess,
  professionals: SectionProfessionals,
  whyChooseUs: SectionWhyChooseUs,
  faq: SectionFaq,
  finalCta: SectionFinalCta,
  testimonials: SectionTestimonials
}

const sections = computed(() => {
  if (!service.value) return []

  return layoutOrder.map((sectionKey, index) => {
    const data = service.value?.sections[sectionKey]

    return {
      type: sectionKey,
      data: data
        ? {
            ...data,
            bgSection:
              index === 0
                ? undefined
                : index % 2 === 0
                  ? 'bg-section-bg-1'
                  : 'bg-section-bg-2'
          }
        : undefined
    }
  })
})
</script>

<template>
  <div>
    <component
      :is="sectionComponents[section.type] || 'div' "
      v-for="section in sections"
      :key="section.type"
      :section="section.data"
    />
  </div>
</template>
