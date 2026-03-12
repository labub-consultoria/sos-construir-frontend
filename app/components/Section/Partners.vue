<script setup lang="ts">
import type { PartnersSection } from '~/types/sections'

const defaultSection: PartnersSection = {
  kicker: 'PARCEIROS CONFIÁVEIS',
  title: 'Temos os Melhores Materiais',
  description: 'Trabalhamos com as principais marcas do mercado. Materiais direto da fábrica, preço justo e qualidade garantida para sua obra.',
  tags: [
    { icon: 'mdi:check-circle-outline', text: 'Materiais premium' },
    { icon: 'mdi:check-circle-outline', text: 'Entrega rastreável' },
    { icon: 'mdi:check-circle-outline', text: 'Preço de fábrica' }
  ],
  ctaText: 'Ver Catálogo',
  ctaLink: '#',
  partners: [
    { id: 1, name: 'Foz Tintas', logo: '/images/services/pintor/foztintas/logo.png', link: '#' },
    { id: 2, name: 'Foz Tintas', logo: '/images/services/pintor/foztintas/logo.png', link: '#' },
    { id: 3, name: 'Foz Tintas', logo: '/images/services/pintor/foztintas/logo.png', link: '#' },
    { id: 4, name: 'Foz Tintas', logo: '/images/services/pintor/foztintas/logo.png', link: '#' },
    { id: 5, name: 'Foz Tintas', logo: '/images/services/pintor/foztintas/logo.png', link: '#' },
    { id: 6, name: 'Foz Tintas', logo: '/images/services/pintor/foztintas/logo.png', link: '#' },
    { id: 7, name: 'Foz Tintas', logo: '/images/services/pintor/foztintas/logo.png', link: '#' }
  ],
  bgSection: 'bg-section-bg-1'
}

const props = defineProps<{
  section?: Partial<PartnersSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section
}))
</script>

<template>
  <section
    class="py-16 md:py-24 w-full overflow-hidden"
    :class="section?.bgSection || 'bg-white'"
  >
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="flex flex-col items-center text-center mb-12">
        <span class="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3">
          {{ section?.kicker }}
        </span>
        <h2 class="title-section">
          {{ section?.title }}
        </h2>
        <p class="text-section-subtitle text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          {{ section?.description }}
        </p>

        <div
          v-if="section?.tags && section.tags.length > 0"
          class="flex flex-wrap justify-center items-center gap-y-3 mb-10 text-sm font-medium text-section-subtitle"
        >
          <template
            v-for="(feature, index) in section.tags"
            :key="index"
          >
            <div class="flex items-center gap-1.5 px-3">
              <Icon
                :name="feature.icon"
                class="text-orange-500 text-lg"
              />
              <span>{{ feature.text }}</span>
            </div>
            <span
              v-if="index < section.tags.length - 1"
              class="text-gray-200 hidden sm:block"
            >|</span>
          </template>
        </div>

        <UButton
          v-if="section?.ctaText"
          :to="section.ctaLink"
          color="primary"
          variant="solid"
          size="lg"
          class="text-white font-bold px-8 py-3 rounded-lg transition-colors"
        >
          {{ section.ctaText }}
          <template #trailing>
            <Icon
              name="mdi:arrow-right"
              class="text-xl"
            />
          </template>
        </UButton>
      </div>

      <div class="w-full mt-16 px-4">
        <UCarousel
          v-slot="{ item }"
          loop
          :auto-scroll="{ speed: 1 }"
          :items="section?.partners"
          :ui="{
            item: 'basis-1/2 md:basis-1/3 lg:basis-1/5 snap-center'
          }"
          class="w-full"
        >
          <div class="px-3 py-2 w-full flex justify-center">
            <div class="bg-white rounded-2xl p-6 w-full max-w-[200px] h-32 flex items-center justify-center shadow-sm shadow-gray-50 border border-gray-50/50 hover:shadow-md transition-shadow">
              <img
                :src="item.logo"
                :alt="item.name"
                class="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity"
                draggable="false"
              >
            </div>
          </div>
        </UCarousel>
      </div>
    </div>
  </section>
</template>
