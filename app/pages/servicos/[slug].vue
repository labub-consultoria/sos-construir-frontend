<template>
  <div>
    <div v-if="service && !loading">
      <!-- Meta tags dinâmicas -->
      <Head>
        <title>{{ service.meta.title }}</title>
        <Meta
          name="description"
          :content="service.meta.description" />
        <Meta
          name="keywords"
          :content="service.meta.keywords" />
        <Meta
          property="og:title"
          :content="service.meta.title" />
        <Meta
          property="og:description"
          :content="service.meta.description" />
        <Meta
          property="og:image"
          :content="service.meta.ogImage" />
      </Head>

      <service-hero-section
        :title="service.sections.hero.title"
        :subtitle="service.sections.hero.subtitle"
        :image="service.sections.hero.image"
      />
      <service-partner-showcase-section />
      <WorksGallerySection />
      <OurProcessSection />
      <ProfessionalsShowcase />
      <ClientsFeedbackSection />
      <WhyChooseUsSection />
      <FaqSection />
      <FinalCtaSection />
    </div>

    <div v-else-if="!loading && !service">
      <NotFound />
    </div>

    <!-- Loading -->
    <div
      v-else
      class="flex items-center justify-center min-h-screen">
      <div class="animate-spin">
        <Icon
          name="mdi:loading"
          size="48"
          class="text-orange-500" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { Service } from '~/types/service'
import servicesData from '~/data/services.json'

const route = useRoute()
const slug = route.params.slug as string

// Estado com tipagem
const service = ref<Service | null>(null)
const loading = ref(true)

/**
 * Buscar serviço do JSON
 * Capitaliza slug: "pintor" → "Pintor"
 */
const loadService = () => {
  loading.value = true

  try {
    // Capitalizar primeiro caractere
    const serviceKey = slug.charAt(0).toUpperCase() + slug.slice(1)

    // Buscar em services.json
    const foundService = (servicesData as Record<string, Service>)[serviceKey]

    if (foundService) {
      service.value = foundService
    } else {
      service.value = null
    }
  } catch (error) {
    console.error('Erro ao carregar serviço:', error)
    service.value = null
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadService()
})

// Tipagem
useHead({
  title: computed(() => service.value?.meta.title || 'Serviço'),
  meta: computed(() => [
    {
      name: 'description',
      content: service.value?.meta.description || ''
    }
  ])
})
</script>
