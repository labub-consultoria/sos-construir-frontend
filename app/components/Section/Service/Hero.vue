<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { ServiceHeroSection } from '~/types/servicePage'
import type { BreadcrumbItem } from '@nuxt/ui'

const defaultSection: ServiceHeroSection = {
  title: 'Se ficar com alguma dúvida',
  description: 'Entre em contato com nossa equipe',
  primaryCta: {
    text: 'Solicitar Orçamento',
    link: DEFAULT_CTA_WHATSAPP_LINK,
    icon: 'mdi:chat-outline',
  },
  secondaryCta: {
    text: 'Ver profissionais disponíveis',
    link: '/profissionais',
    icon: 'mdi:arrow-right',
  },
  features: [
    {
      text: 'Profissionais certificados',
      icon: 'mdi:lightning-bolt'
    },
    {
      text: 'Garantia integral',
      icon: 'mdi:shield-check-outline'
    },
    {
      text: 'Sem taxa escondida',
      icon: 'mdi:check'
    }
  ],
  image: ''
}
const props = defineProps<{
  section?: Partial<ServiceHeroSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))
const route = useRoute()

// Lógica para montar o Breadcrumb baseado na URL
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const paths = route.path.split('/').filter(Boolean)

  const items: BreadcrumbItem[] = [
    { label: 'Home', to: '/' }
  ]

  let currentPath = ''

  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const isLast = index === paths.length - 1
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')

    items.push({
      label,
      to: isLast ? undefined : currentPath
    })
  })

  return items
})

const formattedTitle = computed(() => {
  const title = section.value?.title ?? ''
  return title.replace(/(Dor de Cabeça)/gi, '<span class="text-orange-500">$1</span>')
})
</script>

<template>
  <section class="relative w-full min-h-[600px] flex items-center bg-white overflow-hidden">
    <div class="absolute inset-0 z-0 flex justify-end">
      <img v-if="props.section" :src="props.section.image" alt="Profissional trabalhando"
        class="w-full md:w-3/4 lg:w-2/3 h-full object-cover object-right" />
      <div
        class="absolute inset-0 bg-gradient-to-r from-white via-white to-white/50 md:via-white/30 md:to-transparent" />
    </div>

    <div class="container max-w-7xl mx-auto px-4 py-6 relative z-10">
      <div class="max-w-3xl">

        <UBreadcrumb :items="breadcrumbItems" class="mb-4" />

        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 leading-tight mb-4"
          v-html="formattedTitle" />

        <p class="text-section-subtitle text-lg mb-8 max-w-lg">
          {{ section.description }}
        </p>

        <ul class="space-y-3 mb-10">
          <li v-for="feature of section.features" :key="feature.text"
            class="flex items-center gap-3 text-section-subtitle font-medium">
            <Icon :name="feature.icon" class="text-orange-500 text-xl" />
            {{ feature.text }}
          </li>
        </ul>

        <div v-if="section.primaryCta && section.secondaryCta"
          class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <UButton color="primary" variant="solid" size="xl" :to="section.primaryCta.link"
            class="text-white font-bold rounded-lg px-8 py-3 transition-colors" :icon="section.primaryCta.icon">
            {{ section.primaryCta.text }}
          </UButton>
          <UButton color="primary" variant="ghost" size="lg" :to="section.secondaryCta.link"
            class="font-semibold rounded-lg p-4 transition-colors" :trailing-icon="section.secondaryCta.icon">
            {{ section.secondaryCta.text }}
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
