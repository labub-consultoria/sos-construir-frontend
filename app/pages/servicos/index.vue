<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { FinalCtaSection, ServiceCard } from '@/types/sections'
import type { Category, Service } from '@/types/service'

import type { BreadcrumbItem } from '@nuxt/ui'
import categoriesData from '@/data/servicesCategories.json'
import type Meta from '~/types/meta'

const categories = [{ name: 'Todos', slug: 'todos' }, ...categoriesData.categories] as Category[]

const loadMoreTrigger = useTemplateRef('loadMoreTrigger')

const {
  visibleCount,
  searchQuery,
  selectedCategory,
  filteredServices,
  visibleServices,
  setCategory,
  loadMore,
  clearFilters,
} = useServices()

const finalCtaSection: FinalCtaSection = {
  title: 'Não Encontrou o Serviço que Procura?',
  description:
    'Temos ainda mais soluções customizadas! Entre em contato para conhecer todas as nossas opções disponíveis.',
}
const meta: Meta = {
  title: 'Serviços de Construção e Reforma em Foz do Iguaçu | SOS Construir',
  description:
    'Eletricista, encanador, pintor, pedreiro, energia solar e muito mais. A SOS Construir conecta você aos melhores especialistas de Foz do Iguaçu com garantia, sem dor de cabeça. Peça seu orçamento.',
  keywords:
    'serviços de construção Foz do Iguaçu, reforma residencial Foz do Iguaçu, eletricista Foz do Iguaçu, encanador Foz do Iguaçu, pintor Foz do Iguaçu, pedreiro Foz do Iguaçu, empresa de reforma, construção civil, mão de obra qualificada, orçamento de obra, empresa de construção Foz do Iguaçu, SOS Construir',
  ogImage: '/og-image.jpg',
  breadcrumbLabel: 'Serviços',
}
useSeoMeta({
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,

  ogTitle: meta.title,
  ogDescription: meta.description,
  ogImage: meta.ogImage,

  twitterTitle: meta.title,
  twitterDescription: meta.description,
  twitterImage: meta.ogImage,
  twitterCard: 'summary_large_image',
})
const items = ref<BreadcrumbItem[]>([{ label: 'Home', to: '/' }, { label: 'Serviços' }])

const mappedCards = computed<ServiceCard[]>((
  () => {
    return visibleServices.value.map((s: Service): ServiceCard => {
      return {
        ...s,
        link: `/servicos/${s.slug}`,
        size: 'medium',
        type: 'image'
      }
    })
  }
))

// Resetar paginação quando o usuário digitar algo novo na pesquisa
watch(searchQuery, () => {
  visibleCount.value = 12
})

// Scroll Infinito
useIntersectionObserver(
  loadMoreTrigger,
  ([entry]) => {
    if (entry?.isIntersecting && visibleCount.value < filteredServices.value.length) {
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
                @click="searchQuery = ''" />
            </template>
          </UInput>
        </div>
      </div>

      <UScrollArea v-slot="{ item }" :items="categories" orientation="horizontal"
        class="w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 mb-5 py-2 gap-3">
        <button class="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 mx-2"
          :class="[
            selectedCategory === item.slug
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-500 hover:text-orange-500',
          ]" @click="setCategory(item.slug)">
          {{ item.name }}
        </button>
      </UScrollArea>

      <div v-if="filteredServices.length === 0" class="py-20 text-center flex flex-col items-center justify-center">
        <UIcon name="i-heroicons-magnifying-glass" class="text-gray-300 text-6xl mb-4" />
        <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhum serviço encontrado</h3>
        <p class="text-gray-500">Não encontramos nenhum resultado para "{{ searchQuery }}".</p>
        <UButton class="mt-4" color="primary" variant="soft" @click="clearFilters">
          Limpar filtros
        </UButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ServiceCard v-for="card in mappedCards" :key="card.id" :card="card" class="min-h-72" />
      </div>

      <div ref="loadMoreTrigger" v-show="visibleCount < filteredServices.length"
        class="h-20 flex items-center justify-center ">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl text-orange-500" />
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
