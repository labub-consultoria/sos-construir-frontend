<script setup lang="ts">
import type { OverviewSection } from '~~/shared/types/servicePage'

const props = defineProps<{
  section: OverviewSection
}>()

const images = computed(() => props.section.images ?? [])
const imageAlt = computed(() => props.section.imageAlt || props.section.title || 'SOS Construir')
</script>

<template>
  <section class="py-16" :class="section.bgSection">
    <UContainer>
      <div class="grid lg:grid-cols-3 gap-2 lg:gap-12 items-stretch">

        <!-- Imagens (desktop) -->
        <div v-if="images.length" class="flex flex-col gap-4">
          <NuxtImg :src="images[0]" :alt="imageAlt"
            class="hidden lg:block w-full object-cover rounded-2xl shadow-sm"
            :class="images[1] ? 'h-[450px]' : 'h-[560px]'" loading="lazy" />
          <NuxtImg v-if="images[1]" :src="images[1]" :alt="imageAlt"
            class="hidden lg:block w-full h-[250px] object-cover rounded-2xl shadow-sm" loading="lazy" />
        </div>

        <!-- Texto -->
        <div class="flex flex-col justify-center" :class="images.length ? 'lg:col-span-2' : 'lg:col-span-3'">

          <p v-if="section.kicker" class="text-orange-500 font-bold text-xs uppercase tracking-wider mb-4">
            {{ section.kicker }}
          </p>

          <h2 v-if="section.title" class="title-section">
            {{ section.title }}
          </h2>

          <NuxtImg v-if="images.length" :src="images[0]" :alt="imageAlt"
            class="w-full lg:hidden h-[250px] my-3 object-cover rounded-2xl shadow-sm" loading="lazy" />

          <div class="space-y-4 text-gray-600 leading-relaxed mb-8 text-[16px]">
            <p v-for="(paragraph, index) in section.paragraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>

          <!-- Stats -->
          <div v-if="section.stats?.length" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="(stat, index) in section.stats" :key="index"
              class="flex flex-col bg-gray-50/70 items-start gap-4 p-4 rounded-xl border border-gray-100/50 hover:border-orange-200 hover:bg-orange-50/30 transition-all group">
              <div class="w-12 h-12 bg-orange-100/50 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                <UIcon :name="stat.icon" class="w-6 h-6 text-orange-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-2xl font-bold text-blue-500 mb-1">{{ stat.value }}</p>
                <p class="text-sm text-gray-500 leading-relaxed">{{ stat.label }}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </UContainer>
  </section>
</template>
