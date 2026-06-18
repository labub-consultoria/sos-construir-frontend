<script setup lang="ts">
import {
  SectionTestimonials,
  SectionServiceHero,
  SectionServicePartnerShowcase,
  SectionWorksGallery,
  SectionOurProcess,
  SectionProfessionals,
  SectionFaq,
  SectionFinalCta,
  SectionWhyChooseUs,
} from '#components'
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const sectionComponents: Record<SectionKey, Component> = {
  hero: SectionServiceHero,
  partner: SectionServicePartnerShowcase,
  workGallery: SectionWorksGallery,
  process: SectionOurProcess,
  professionals: SectionProfessionals,
  whyChooseUs: SectionWhyChooseUs,
  faq: SectionFaq,
  finalCta: SectionFinalCta,
  testimonials: SectionTestimonials,
}

const layoutOrder: SectionKey[] = [
  'hero',
  'partner',
  'process',
  'professionals',
  'testimonials',
  'workGallery',
  'whyChooseUs',
  'faq',
  'finalCta',
]

const { data: service, error } = await useFetch<{
  baseService: Service
  pageContent: ServicePage
}>(`/api/servicos/${route.params.slug}`)

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, fatal: true })
}

const pageContent = computed<ServicePage | null>(
  () => service.value?.pageContent ?? null
)
// SEO

useSeoMeta({
  title: () => `${pageContent.value?.meta.title}`,
  description: () => pageContent.value?.meta.description,
  ogTitle: () => pageContent.value?.meta.title,
  ogDescription: () => pageContent.value?.meta.description,
})

// OG image dinâmico por serviço (card de marca). Assume og:image/twitter:image.
defineOgImage('SosConstruir', {
  label: 'Serviço',
  title: pageContent.value?.meta.title ?? service.value?.baseService.name
})

useSchemaOrg([
  defineWebPage({
    '@type': ['WebPage', 'ItemPage'],
    name: pageContent.value?.meta.title ?? service.value?.baseService.name,
    mainEntity: {
      '@type': 'Service',
      name: pageContent.value?.meta.title ?? service.value?.baseService.name,
      description:
        pageContent.value?.meta.description ?? service.value?.baseService.description,
      serviceType: service.value?.baseService.category,
      provider: { '@id': 'https://sosconstruir.com.br/#identity' },
      areaServed: { '@type': 'City', name: 'Foz do Iguaçu' }
    }
  })
])

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Home', to: '/' },
  { label: 'Serviços', to: '/servicos' },
  { label: pageContent.value?.meta.title ?? service.value?.baseService.name }
])

useBreadcrumbSchema(breadcrumbItems)

const sections = computed(() => {
  if (!pageContent.value) return []

  return layoutOrder
    .map((sectionKey, index) => {
      const data = pageContent.value!.sections[sectionKey]
      if (!data) return null

      return {
        type: sectionKey,
        component: sectionComponents[sectionKey],
        data: {
          ...data,
          bgSection: index === 0 ? undefined : index % 2 === 0 ? 'bg-section-bg-1' : 'bg-section-bg-2',
        },
      }
    })
    .filter(Boolean)
})
</script>

<template>
  <div>
    <PageUnderConstruction v-if="!pageContent" />

    <template v-for="section in sections" :key="section!.type">
      <component :is="section!.component" v-if="section!.component" :section="section!.data" />
    </template>
  </div>
</template>