<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const id = route.params.id as string

const { project, relatedProjects, error } = useProjectDetail(id)

if (error.value) {
  throw createError({ statusCode: 404, fatal: true })
}
if (project.value) {
  useSeoMeta({
    title: `${project.value.title} | SOS Construir`,
    description: project.value.description,
    ogImage: project.value.imageUrl,
  })
}

const activeCardId = ref<number | string | null>(null)

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: project.value.title ?? `Projeto #${id}` },
])

useBreadcrumbSchema(breadcrumbItems)

const projectDetails = computed(() => {
  if (!project.value) return []

  return [
    {
      label: 'Localização',
      icon: 'i-heroicons-map-pin',
      value: project.value.location
    },
    {
      label: 'Duração',
      icon: 'i-heroicons-clock',
      value: project.value.duration
    },
    {
      label: 'Ano',
      icon: 'i-heroicons-calendar',
      value: project.value.year
    },
    {
      label: 'Categoria',
      icon: 'i-heroicons-tag',
      value: project.value.category,
      class: 'capitalize'
    },
    {
      label: 'Responsável',
      icon: 'i-heroicons-user',
      value: project.value.author
    }
  ].filter(item => item.value)
})
const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function onClickPrev() {
  activeIndex.value--
}
function onClickNext() {
  activeIndex.value++
}
function onSelect(index: number) {
  activeIndex.value = index
}

function select(index: number) {
  activeIndex.value = index

  carousel.value?.emblaApi?.scrollTo(index)
}

</script>

<template>
  <div v-if="project" class="min-h-screen bg-gray-50/80 pt-8 pb-20">
    <UContainer>
      <div class="mb-8">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <!-- COLUNA PRINCIPAL -->
        <div class="lg:col-span-8 flex flex-col gap-8">
          <!-- Descrição -->
          <div>
            <h1 class="title-section mb-4">{{ project.title }}</h1>
            <p class="text-slate-500 text-lg leading-relaxed">{{ project.description }}</p>
          </div>

          <!-- Detalhes do projeto -->
          <UCard class="block lg:hidden bg-white border border-gray-100">
            <h3 class="font-bold text-blue-500 text-lg mb-6">Detalhes do projeto</h3>
            <ul class="space-y-4">
              <li v-for="item in projectDetails" :key="item.label" class="flex items-center gap-3 text-sm">
                <UIcon :name="item.icon" class="w-4 h-4 text-orange-500 shrink-0" />
                <span class="text-gray-500">{{ item.label }}</span>

                <span class="ml-auto font-semibold text-blue-500" :class="item.class">
                  {{ item.value }}
                </span>
              </li>
            </ul>
          </UCard>

          <!-- Imagem principal -->
          <div
            class="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm flex justify-center content-center">

            <UCarousel ref="carousel" v-slot="{ item }" autoplay :items="project.gallery"
              :prev="{ onClick: onClickPrev }" :next="{ onClick: onClickNext }" class="" @select="onSelect">
              <NuxtImg :src="item" class="aspect-video w-full object-cover transition-all duration-500"
                loading="lazy" />
            </UCarousel>
          </div>

          <!-- Seletor de imagem -->
          <div class="flex gap-5 justify-center pt-4 w-full">
            <div v-for="(item, index) in project.gallery" :key="index"
              class="aspect-square opacity-25 hover:opacity-100 transition-opacity"
              :class="{ 'opacity-100': activeIndex === index }" @click="select(index)">
              <NuxtImg :src="item" width="44" height="44" class="rounded-lg w-full h-full object-cover"
                loading="lazy" />
            </div>
          </div>

          <!-- Before/After se aplicável -->
          <div v-if="project.type === 'before-after'" class="grid grid-cols-2 gap-4">
            <div class="rounded-2xl overflow-hidden relative">
              <NuxtImg :src="project.beforeImageUrl" class="w-full aspect-video object-cover" />
              <span class="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full">
                ANTES
              </span>
            </div>
            <div class="rounded-2xl overflow-hidden relative">
              <NuxtImg :src="project.imageUrl" class="w-full aspect-video object-cover" />
              <span class="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                DEPOIS
              </span>
            </div>
          </div>

          <!-- Serviços realizados -->
          <div>
            <h2 class="font-bold text-blue-500 text-xl mb-4">Serviços realizados</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="service in project.services" :key="service"
                class="px-4 py-2 bg-white border border-gray-100 text-gray-600 text-sm font-semibold rounded-full">
                {{ service }}
              </span>
            </div>
          </div>

          <!-- Projetos relacionados -->
          <div v-if="relatedProjects.length">
            <h2 class="font-bold text-blue-500 text-xl mb-6">Outros projetos</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <WorksGalleryCard v-for="related in relatedProjects" :key="related.id" :work="related"
                :is-active="activeCardId === related.id" @click.stop="activeCardId = related.id" />
            </div>
          </div>
          <!-- Voltar -->
          <UButton to="/portfolio" variant="outline" block size="lg"
            class="font-bold text-orange-500 border-orange-200 hover:bg-orange-50">
            <template #leading>
              <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
            </template>
            Ver todos os projetos
          </UButton>
        </div>

        <!-- SIDEBAR -->
        <aside class="lg:col-span-4 space-y-6">

          <!-- Detalhes do projeto -->
          <UCard class="hidden lg:block bg-white border border-gray-100">
            <h3 class="font-bold text-blue-500 text-lg mb-6">Detalhes do projeto</h3>
            <ul class="space-y-4">
              <li v-for="item in projectDetails" :key="item.label" class="flex items-center gap-3 text-sm">
                <UIcon :name="item.icon" class="w-4 h-4 text-orange-500 shrink-0" />
                <span class="text-gray-500">{{ item.label }}</span>

                <span class="ml-auto font-semibold text-blue-500" :class="item.class">
                  {{ item.value }}
                </span>
              </li>
            </ul>
          </UCard>
          <!-- CTA -->
          <UCard class="bg-white border border-gray-100">
            <h3 class="font-bold text-blue-500 text-xl mb-3">Quer um projeto assim?</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Fale com nossa equipe e transforme seu espaço com quem já entregou mais de 1000 projetos.
            </p>
            <UButton :to="DEFAULT_CTA_WHATSAPP_LINK" target="_blank" color="primary" block size="lg"
              class="font-bold shadow-md">
              Falar com especialista
            </UButton>
          </UCard>

        </aside>
      </div>
    </UContainer>
  </div>
</template>
