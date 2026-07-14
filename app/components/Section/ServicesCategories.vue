<script setup lang="ts">
import type { ServicesSection } from '~~/shared/types/sections'
import servicesData from '@/data/services.json'

// Contagem derivada do catálogo (dezena arredondada pra baixo): número fixo no texto
// já mentiu antes — dizia "30+" com 70 serviços no ar.
const servicesCount = Math.floor(servicesData.services.length / 10) * 10

const defaultSection: ServicesSection = {
  kicker: 'EXPLORE POR CATEGORIA',
  title: 'Nossas Soluções',
  description: 'Tudo o que sua casa precisa, em um único lugar.',
  ctaText: `Ver todos os ${servicesCount}+ Serviços`,
  ctaLink: '/servicos',
  bgSection: 'bg-section-bg-2',
}

const props = defineProps<{
  section?: Partial<ServicesSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))
</script>

<template>
  <section class="py-16 md:py-24 w-full" :class="section.bgSection">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span class="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3">
            {{ section.kicker }}
          </span>
          <h2 class="title-section">
            {{ section.title }}
          </h2>
          <p class="text-section-subname text-base md:text-lg">
            {{ section.description }}
          </p>
        </div>

        <UButton v-if="section.ctaText" :to="section.ctaLink" color="primary" variant="outline" size="lg"
          class="hidden md:flex items-center py-2.5 px-9 rounded-lg font-bold transition-colors">
          {{ section.ctaText }}
          <template #trailing>
            <Icon name="mdi:arrow-right" class="text-lg" />
          </template>
        </UButton>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard v-for="card in section.services" :key="card.id" :card="card" />
      </div>
      <div class="mt-8 flex md:hidden justify-center">
        <UButton v-if="section.ctaText" :to="section.ctaLink" color="primary" variant="outline" size="lg"
          class="w-full flex justify-center font-bold">
          {{ section.ctaText }}
          <template #trailing>
            <Icon name="mdi:arrow-right" class="text-xl" />
          </template>
        </UButton>
      </div>
    </div>
  </section>
</template>
