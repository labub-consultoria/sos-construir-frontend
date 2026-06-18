<script setup lang="ts">
import {
  SectionTestimonials,
  SectionServiceHero,
  SectionServiceOverview,
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
  overview: SectionServiceOverview,
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
  'overview',
  'partner',
  'process',
  'professionals',
  'testimonials',
  'workGallery',
  'whyChooseUs',
  'faq',
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

// Resposta direta da overview (1º parágrafo) — leva o trecho mais "citável"
// para os dados estruturados (Service.description), reforçando a entidade p/ IA.
const overviewLead = computed(
  () => pageContent.value?.sections.overview?.paragraphs?.[0]
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
        overviewLead.value
        ?? pageContent.value?.meta.description
        ?? service.value?.baseService.description,
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

    <template v-else>
      <template v-for="section in sections" :key="section!.type">
        <component :is="section!.component" v-if="section!.component" :section="section!.data" />
      </template>

      <SectionFinalCta :section="pageContent.sections.finalCta" />
    </template>
  </div>
</template>