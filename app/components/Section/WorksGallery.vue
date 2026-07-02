<script setup lang="ts">
import WorksGalleryCard from '../WorksGalleryCard.vue'
import type { WorkGallerySection } from '~~/shared/types/sections'

const defaultSection: WorkGallerySection = {
  title: 'Confira Nossos Trabalhos',
  description:
    'Centenas de projetos transformados em Foz do Iguaçu. Qualidade, dedicação e resultado que fala por si.',
  filters: [],
  ctaText: 'Ver nosso Portfolio',
  ctaLink: '/portfolio',
}

const props = defineProps<{
  section: Partial<WorkGallerySection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))

const { activeFilter, rowOne, rowTwo, loading, setFilter, getCount } = useWorksGallery()

const activeCardId = ref<number | string | null>(null)

const projectStats = [
  { icon: 'mdi:star-outline', text: '4.8/5 Avaliação de Clientes' },
  { icon: 'mdi:checkbox-multiple-marked-circle-outline', text: '1000+ Projetos Entregues' },
]
</script>

<template>
  <section class="py-16 md:py-24 w-full overflow-hidden" :class="section.bgSection" @click="activeCardId = null">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

        <!-- ESQUERDA -->
        <div class="lg:col-span-4 flex flex-col">
          <div>
            <h2 class="text-4xl lg:text-5xl font-bold text-blue-500 mb-6 leading-tight tracking-tight">
              {{ section.title }}
            </h2>
            <p class="text-section-subtitle text-base lg:text-lg mb-8 leading-relaxed">
              {{ section.description }}
            </p>

            <div class="space-y-3 mb-10">
              <UButton v-for="filter in section.filters" :key="filter.slug" variant="ghost"
                class="w-full flex justify-between items-center px-6 py-4 rounded-xl border-2 transition-all font-bold group"
                :class="[
                  activeFilter === filter.slug
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                    : 'bg-white text-section-subtitle border-gray-100/60 hover:border-gray-200 hover:bg-gray-50',
                ]" @click.stop="setFilter(filter.slug)">
                {{ filter.label }}
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="[
                  activeFilter === filter.slug
                    ? 'bg-white text-orange-500'
                    : 'bg-gray-100 text-section-subtitle',
                ]">
                  {{ getCount(filter.slug) }}
                </span>
              </UButton>
            </div>

            <div class="hidden lg:block space-y-4 mb-8 rounded-xl p-6 border border-gray-100">
              <div v-for="stat in projectStats" :key="stat.text" class="flex items-center gap-3">
                <Icon :name="stat.icon" class="text-orange-500 text-xl flex-shrink-0" />
                <span class="text-blue-500 font-bold text-sm">{{ stat.text }}</span>
              </div>
            </div>

            <UButton variant="outline" size="lg" :to="section.ctaLink"
              class="hidden lg:flex w-full justify-center text-orange-500 border-orange-200 hover:bg-orange-50 py-3 rounded-lg font-bold">
              {{ section.ctaText }}
              <template #trailing>
                <Icon name="mdi:arrow-right" class="text-xl" />
              </template>
            </UButton>
          </div>
        </div>

        <!-- DIREITA: Carrosséis -->
        <div class="lg:col-span-8 relative">
          <div v-if="loading" class="grid grid-cols-3 grid-rows-2 gap-6">
            <USkeleton v-for="i in 6" :key="i" class="w-full aspect-[2/3] rounded-2xl" />
          </div>

          <div v-else class="flex flex-col gap-5">
            <UCarousel v-slot="{ item }" :prev="{ color: 'primary' }" :next="{ variant: 'solid' }" :items="rowOne" :ui="{
              item: 'basis-3/5 sm:basis-1/3',
            }" loop :autoplay="{
              delay: 4400
            }">
              <WorksGalleryCard :work="item" :is-active="activeCardId === item.id" />
            </UCarousel>

            <UCarousel v-slot="{ item }" :prev="{ color: 'primary' }" :next="{ variant: 'solid' }" :items="rowTwo" :ui="{
              item: 'basis-3/5 sm:basis-1/3',
            }" loop :autoplay="{
              delay: 3500
            }" class="min-h-52">
              <WorksGalleryCard :work="item" :is-active="activeCardId === item.id" />
            </UCarousel>
          </div>
        </div>

        <!-- MOBILE: Stats + CTA -->
        <div class="col-span-1 flex lg:hidden mt-2 flex-col min-h-32">
          <div class="space-y-4 mb-8 rounded-xl p-6 border border-gray-100">
            <div v-for="stat in projectStats" :key="stat.text" class="flex items-center gap-3">
              <Icon :name="stat.icon" class="text-orange-500 text-xl flex-shrink-0" />
              <span class="text-blue-500 font-bold text-sm">{{ stat.text }}</span>
            </div>
          </div>

          <UButton variant="outline" size="lg" :to="section.ctaLink"
            class="w-full flex justify-center text-orange-500 border-orange-200 hover:bg-orange-50 py-3 rounded-lg font-bold">
            {{ section.ctaText }}
            <template #trailing>
              <Icon name="mdi:arrow-right" class="text-xl" />
            </template>
          </UButton>
        </div>

      </div>
    </div>
  </section>
</template>