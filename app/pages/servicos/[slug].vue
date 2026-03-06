<script setup lang="ts">
import type { Service, SectionKey } from '~/types/service'

import {
  SectionServiceHero,
  SectionServicePartnerShowcase,
  SectionWorksGallery,
  SectionOurProcess,
  SectionProfessionals,
  SectionFaq,
  SectionServiceWhatWeDo
} from '#components'

import servicesData from '~/data/services.json'

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

const sectionComponents: Record<SectionKey, Component> = {
  hero: SectionServiceHero,
  whatWeDo: SectionServiceWhatWeDo,
  partner: SectionServicePartnerShowcase,
  workGallery: SectionWorksGallery,
  process: SectionOurProcess,
  professionals: SectionProfessionals,
  faq: SectionFaq
}

const sections = computed(() => {
  if (!service.value) return []

  return Object.entries(service.value.sections).map(([key, value]) => ({
    type: key as SectionKey,
    data: value
  }))
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

    <SectionFinalCta />
  </div>
</template>
