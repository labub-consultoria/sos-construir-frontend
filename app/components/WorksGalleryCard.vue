<script setup lang="ts">
import WorksGalleryCardBeforeAfter from './WorksGalleryCardBeforeAfter.vue'
import type { ProjectWork } from '~/types/projectWork'

const _props = defineProps<{
  work: ProjectWork
  isActive?: boolean
}>()
</script>

<template>
  <WorksGalleryCardBeforeAfter
    v-if="work.type === 'before-after' && work.beforeImageUrl"
    :before-image-url="work.beforeImageUrl"
    :after-image-url="work.imageUrl"
    :aspect-ratio="work.aspectRatio"
  />

  <div
    v-else
    class="relative w-full rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-shadow"
    :style="{ aspectRatio: work.aspectRatio || '2/3' }"
  >
    <img
      :src="work.imageUrl"
      :alt="work.title || 'Projeto'"
      class="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 lg:group-hover:scale-105"
      :class="{ 'scale-105': isActive }"
    >

    <div
      class="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end transition-opacity duration-300"
      :class="isActive ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'"
    >
      <div
        v-if="work.tag"
        class="bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest inline-block mb-3 max-w-max"
      >
        {{ work.tag }}
      </div>

      <h4
        v-if="work.title"
        class="text-white font-bold text-2xl mb-1.5 leading-tight"
      >
        {{ work.title }}
      </h4>

      <div
        v-if="work.author"
        class="text-white/80 text-sm flex items-center gap-1.5 mb-5"
      >
        <Icon
          name="mdi:account-outline"
          class="text-sm"
        />
        {{ work.author }}
      </div>

      <UButton
        color="neutral"
        variant="subtle"
        class="w-full bg-white/10 hover:bg-white/15 ring-white/20 py-2.5 text-white flex justify-center rounded-lg font-medium transition-colors duration-300 text-sm"
      >
        Ver Detalhes do Projeto
      </UButton>
    </div>
  </div>
</template>
