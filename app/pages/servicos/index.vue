<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import type { BreadcrumbItem } from '@nuxt/ui'
import categoriesData from '@/data/servicesCategories.json'

const categories = [{ name: 'Todos', slug: 'todos' }, ...categoriesData.categories] as Category[]

const loadMoreTrigger = useTemplateRef('loadMoreTrigger')

const {
  visibleCount,
  searchQuery,
  selectedCategory,
  filteredServices,
  visibleServices,
  totalServices,
  pending,
  setCategory,
  loadMore,
  clearFilters,
} = useServices()

// no mobile a lista de categorias é colapsável e começa fechada; no desktop fica sempre visível
const showCategories = ref(false)

const finalCtaSection: FinalCtaSection = {
  title: 'Não Encontrou o Serviço que Procura?',
  description:
    'Temos ainda mais soluções customizadas! Entre em contato para conhecer todas as nossas opções disponíveis.',
}

const meta: Meta = {
  title: 'Serviços de Construção e Reforma em Foz do Iguaçu',
  description:
    'Eletricista, encanador, pintor, pedreiro, energia solar e muito mais. A SOS Construir conecta você aos melhores especialistas de Foz do Iguaçu com garantia, sem dor de cabeça. Peça seu orçamento.',
}

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
  twitterTitle: meta.title,
  twitterDescription: meta.description,
  twitterImage: meta.ogImage,
  twitterCard: 'summary_large_image',
})

const items: BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'Serviços' }]

useBreadcrumbSchema(items)

const mappedCards = computed<ServiceCard[]>(() => {
  return visibleServices.value.map((s): ServiceCard => {
    return {
      ...s,
      link: `/servicos/${s.slug}`,
      size: 'medium',
      type: 'image'
    }
  })
})

// Scroll Infinito: Atualizado para checar contra o total do servidor
useIntersectionObserver(
  loadMoreTrigger,
  ([entry]) => {
    if (entry?.isIntersecting && visibleCount.value < totalServices.value && !pending.value) {
      loadMore()
    }
  },
)
</script>

<template>
  <div class="min-h-screen bg-white pt-12 relative">
    <UContainer>
      <div class="text-sm text-gray-500 mb-6 flex gap-2 items-center">
        <UBreadcrumb :items="items" />
      </div>

      <div class="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="title-section">Explore Nossas Soluções</h1>
          <p class="text-gray-600 text-lg">Tudo o que sua casa precisa, em um único lugar.</p>
        </div>

        <div class="w-full h-full md:max-w-md flex items-end">
          <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Buscar serviços..."
            size="lg" color="primary" variant="outline"
            class="grow bg-transparent border-none outline-none text-sm shadow-md">
            <template v-if="searchQuery?.length" #trailing>
              <UButton color="primary" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
                @click="clearFilters" />
            </template>
          </UInput>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-[2.5fr_9.5fr] gap-8">
        <!-- SIDEBAR de categorias (seleção única) -->
        <aside class="md:sticky md:top-20 self-start">
          <!-- Mobile: cabeçalho-toggle (fechado por padrão). Desktop: título fixo -->
          <button type="button" class="md:hidden w-full flex items-center justify-between mb-4"
            @click="showCategories = !showCategories">
            <span class="font-bold text-blue-500 text-lg">Categorias</span>
            <UIcon :name="showCategories ? 'i-heroicons-chevron-up-20-solid' : 'i-heroicons-chevron-down-20-solid'"
              class="text-blue-500 text-xl" />
          </button>
          <h3 class="hidden md:block font-bold text-blue-500 text-lg mb-4">Categorias</h3>

          <div class="flex-col gap-3 md:flex" :class="showCategories ? 'flex' : 'hidden'">
            <button v-for="item in categories" :key="item.slug" type="button"
              class="text-left text-sm transition-colors"
              :class="selectedCategory === item.slug
                ? 'text-orange-500 font-semibold'
                : 'text-gray-600 hover:text-orange-500'"
              @click="setCategory(item.slug); showCategories = false">
              {{ item.name }}
            </button>
          </div>
        </aside>

        <!-- GRID -->
        <div class="min-h-96">
          <div v-if="filteredServices.length === 0 && !pending && searchQuery.length > 0"
            class="py-20 text-center flex flex-col items-center justify-center min-h-60">
            <UIcon name="i-heroicons-magnifying-glass" class="text-gray-300 text-6xl mb-4" />
            <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhum serviço encontrado</h3>
            <p class="text-gray-500">Não encontramos nenhum resultado para "{{ searchQuery }}".</p>
            <UButton class="mt-4" color="primary" variant="soft" @click="clearFilters">
              Limpar filtros
            </UButton>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-8">
            <ServiceCard v-for="card in mappedCards" :key="card.id" :card="card" class="min-h-72" />
          </div>

          <div v-show="visibleCount < totalServices || pending" ref="loadMoreTrigger"
            class="py-20 min-h-60 flex items-center justify-center">
            <UIcon v-if="pending" name="mdi:loading" class="animate-spin text-3xl text-orange-500" />
          </div>
        </div>
      </div>
    </UContainer>

    <section-final-cta :section="finalCtaSection" />
  </div>
</template>

<style scoped>
/* Esconder scrollbar na lista de categorias no mobile */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
