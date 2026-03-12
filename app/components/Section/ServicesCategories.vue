<script setup lang="ts">
import type { SolutionsSection } from '@/types/sections'

const defaultSection: SolutionsSection = {
  kicker: 'EXPLORE POR CATEGORIA',
  title: 'Nossas Soluções',
  description: 'Tudo o que sua casa precisa, em um único lugar.',
  ctaText: 'Ver todos os 30+ Serviços',
  ctaLink: '/servicos',
  cards: [
    {
      id: 1,
      type: 'image',
      size: 'large',
      title: 'Construção Civil & Reformas',
      description:
        'Do projeto estrutural ao acabamento final. Gerenciamento completo da sua obra residencial ou comercial.',
      icon: 'mdi:hard-hat',
      image:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 2,
      type: 'standard',
      size: 'medium',
      title: 'Instalações Elétricas',
      description: 'Rede residencial, industrial e projetos de energia solar fotovoltaica.',
      icon: 'mdi:lightning-bolt',
    },
    {
      id: 3,
      type: 'standard',
      size: 'medium',
      title: 'Hidráulica',
      description: "Instalação, manutenção, caça-vazamentos e limpeza de caixas d'água.",
      icon: 'mdi:water-outline',
    },
    {
      id: 4,
      type: 'image',
      size: 'medium',
      title: 'Piscinas & Lazer',
      description: 'Construção, manutenção e tratamento de piscinas.',
      icon: 'mdi:water-polo',
      image:
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 5,
      type: 'standard',
      size: 'medium',
      title: 'Pintura & Acabamento',
      description: 'Pintura interna, externa, texturas e efeitos decorativos.',
      icon: 'mdi:format-paint',
    },
  ],
  bgSection: 'bg-section-bg-2',
}

const props = defineProps<{
  section?: Partial<SolutionsSection>
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
          <p class="text-section-subtitle text-base md:text-lg">
            {{ section.description }}
          </p>
        </div>

        <UButton
          v-if="section.ctaText"
          :to="section.ctaLink"
          color="primary"
          variant="outline"
          size="lg"
          class="hidden md:flex items-center py-2.5 px-9 rounded-lg font-bold transition-colors"
        >
          {{ section.ctaText }}
          <template #trailing>
            <Icon name="mdi:arrow-right" class="text-lg" />
          </template>
        </UButton>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard v-for="card in section.cards" :key="card.id" :card="card" />
      </div>
      <div class="mt-8 flex md:hidden justify-center">
        <UButton
          v-if="section.ctaText"
          :to="section.ctaLink"
          color="primary"
          variant="outline"
          size="lg"
          class="w-full flex justify-center font-bold"
        >
          {{ section.ctaText }}
          <template #trailing>
            <Icon name="mdi:arrow-right" class="text-xl" />
          </template>
        </UButton>
      </div>
    </div>
  </section>
</template>
