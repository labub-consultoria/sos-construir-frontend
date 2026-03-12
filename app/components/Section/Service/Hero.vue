<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceHeroSection } from '~/types/servicePage'

const props = defineProps<{
  section: ServiceHeroSection
}>()

const users = [
  {
    id: 2,
    name: 'Rodrigo Goes',
    avatar: 'https://i.pravatar.cc/100?img=1'
  },
  {
    id: 1,
    name: 'Ronaldo Silva',
    avatar: 'https://i.pravatar.cc/100?img=2'
  },
  {
    id: 3,
    name: 'Roger Guedes',
    avatar: 'https://i.pravatar.cc/100?img=3'
  }
]
const formattedTitle = computed(() => {
  if (!props.section.title) return ''
  return props.section.title.replace(
    /(Dor de Cabeça)/gi,
    '<span class="text-orange-500">$1</span>'
  )
})
</script>

<template>
  <section class="relative w-full min-h-[600px] flex items-center bg-white overflow-hidden">
    <div class="absolute inset-0 z-0 flex justify-end">
      <img
        :src="props.section.image"
        alt="Profissional trabalhando"
        class="w-full md:w-3/4 lg:w-2/3 h-full object-cover object-right"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
    </div>

    <div class="container max-w-7xl mx-auto px-4 py-6 relative z-10">
      <div class="max-w-3xl">
        <HeroChip :users="users" />

        <div class="w-8 h-1 bg-orange-500 rounded-full mb-6" />

        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 leading-tight mb-4"
          v-html="formattedTitle"
        />

        <p class="text-section-subtitle text-lg mb-8 max-w-lg">
          {{ section.description }}
        </p>

        <ul class="space-y-3 mb-10">
          <li class="flex items-center gap-3 text-section-subtitle font-medium">
            <Icon
              name="mdi:lightning-bolt"
              class="text-orange-500 text-xl"
            />
            Profissionais certificados
          </li>
          <li class="flex items-center gap-3 text-section-subtitle font-medium">
            <Icon
              name="mdi:shield-check-outline"
              class="text-orange-500 text-xl"
            />
            Garantia integral
          </li>
          <li class="flex items-center gap-3 text-section-subtitle font-medium">
            <Icon
              name="mdi:check"
              class="text-orange-500 text-xl"
            />
            Sem taxa escondida
          </li>
        </ul>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <UButton
            color="primary"
            variant="solid"
            size="xl"
            class=" text-white font-bold rounded-lg px-8 py-3 transition-colors"
          >
            Solicitar Orçamento
            <template #trailing>
              <Icon
                name="mdi:arrow-right"
                class="text-xl"
              />
            </template>
          </UButton>
          <UButton
            color="primary"
            variant="ghost"
            size="lg"
            class=" font-semibold px-4 transition-colors"
          >
            Ver profissionais disponíveis
            <template #trailing>
              <Icon
                name="mdi:arrow-right"
                class="text-xl"
              />
            </template>
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
