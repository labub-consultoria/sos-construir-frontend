<script setup lang="ts">
import { Icon } from '#components'
import type { SolutionCard } from '@/types/sections'

defineProps<{
  card: SolutionCard
}>()
</script>

<template>
  <NuxtLink
    :key="card.id"
    :to="card.link || '#'"
    class="relative rounded-2xl overflow-hidden group transition-all duration-300 md:max-h-[240px]"
    :class="[
      card.size === 'large' ? 'md:col-span-2' : 'md:col-span-1',
      card.type === 'image' ? 'h-[280px] md:h-[240px]' : 'h-full md:min-h-[240px] bg-white border border-gray-100 shadow-sm hover:shadow-md'
    ]"
  >
    <template v-if="card.type === 'image'">
      <UCard class="flex flex-col justify-between h-full">
        <NuxtImg
          :src="card.image"
          :alt="card.title"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent z-10" />
        <template #header>
          <div class="absolute z-20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors bg-black/30 backdrop-blur-md">
            <Icon
              :name="card.icon"
              class="text-orange-500 text-2xl"
            />
          </div>
        </template>
        <template #footer>
          <div class="absolute bottom-10 z-20 p-2 md:p-0 flex flex-col">
            <h3 class="text-lg md:text-xl font-bold text-white mb-3">
              {{ card.title }}
            </h3>
            <p class="text-section-subtitle text-sm text-white/80 leading-relaxed">
              {{ card.description }}
            </p>
            <span class="text-orange-500 flex items-center pt-2">
              Saiba Mais
              <Icon name="mdi:arrow-right"/>
            </span>
          </div>
        </template>
      </UCard>
    </template>

    <template v-else>
      <UCard
        variant="solid"
        class="bg-white"
      >
        <template #header>
          <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
            <Icon
              :name="card.icon"
              class="text-orange-500 text-2xl"
            />
          </div>
        </template>
        <template #footer>
          <div class="p-2 md:p-0 flex flex-col">
            <h3 class="text-lg md:text-xl font-bold text-blue-500 mb-3">
              {{ card.title }}
            </h3>
            <p class="text-section-subtitle text-sm leading-relaxed">
              {{ card.description }}
            </p>
          </div>
        </template>
      </UCard>
    </template>
  </NuxtLink>
</template>
