<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const { selectedFilter, currentPage, projects, total, totalPages, loading, limit, setFilter } =
  usePortfolio()

const filters = [
  { name: 'Todos os Projetos', slug: 'todos' },
  { name: 'Construções', slug: 'construcoes' },
  { name: 'Reformas', slug: 'reformas' },
  { name: 'Piscinas', slug: 'piscinas' },
  { name: 'Acabamentos', slug: 'acabamentos' },
]

const projectStats = [
  { icon: 'mdi:star-outline', text: '4.8/5 Avaliação de Clientes' },
  { icon: 'mdi:checkbox-multiple-marked-circle-outline', text: '1000+ Projetos Entregues' },
]

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio' },
]

useBreadcrumbSchema(breadcrumbItems)

const activeCardId = ref<number | string | null>(null)

useSeoMeta({
  title: 'Portfolio | Nossos Projetos',
  description:
    'Confira centenas de projetos entregues em Foz do Iguaçu. Construções, reformas, acabamentos e muito mais.',
})

</script>

<template>
  <div class="min-h-screen bg-gray-50/30 pt-8 pb-20">
    <UContainer>
      <div class="text-sm text-gray-500 mb-6 flex gap-2 items-center">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div class="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="title-section">Confira Nossos Trabalhos</h1>
          <p class="text-slate-500 text-lg">
            Centenas de projetos transformados em Foz do Iguaçu. Qualidade, dedicação e resultado que fala por si.
          </p>
        </div>
      </div>

      <UScrollArea v-slot="{ item }" :items="filters" orientation="horizontal"
        class="w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 mb-5 py-2 gap-3">
        <button class="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 mx-2"
          :class="[
            selectedFilter === item.slug
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-500 hover:text-orange-500',
          ]" @click.stop="setFilter(item.slug)">
          {{ item.name }}
        </button>
      </UScrollArea>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div class="lg:col-span-8 flex flex-col">

          <!-- Skeleton -->
          <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <USkeleton v-for="i in limit" :key="i" class="w-full aspect-[2/3] rounded-2xl" />
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <WorksGalleryCard v-for="project in projects" :key="project.id" :work="project"
              :is-active="activeCardId === project.id" @click.stop="activeCardId = project.id" />
          </div>

          <div class="mt-auto flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-6">
            <p class="text-sm text-gray-500 mb-4 sm:mb-0">
              Página {{ currentPage }} de {{ totalPages }}
            </p>
            <UPagination v-model:page="currentPage" :items-per-page="limit" :total="total" />
          </div>
        </div>

        <aside class="lg:col-span-4 space-y-8">
          <!-- Stats -->
          <UCard class="bg-white border border-gray-100">
            <div class="flex flex-col gap-3">

              <div v-for="stat in projectStats" :key="stat.text" class="flex items-center gap-3">
                <Icon :name="stat.icon" class="text-orange-500 text-xl shrink-0" />
                <span class="text-blue-500 font-bold text-sm">{{ stat.text }}</span>
              </div>
            </div>
          </UCard>
          <!-- Cta -->
          <UCard class="bg-white border border-gray-100">
            <h3 class="font-bold text-blue-500 text-xl mb-3">Precisa de ajuda com seu projeto?</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Nossa equipe pode orientar sua obra do planejamento ao acabamento final.
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
