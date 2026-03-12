<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver, useWindowScroll } from '@vueuse/core'
import type { FinalCtaSection, SolutionCard } from '@/types/sections'
import type { Service } from '@/types/service'

import data from '@/data/services.json'
import type { BreadcrumbItem } from '@nuxt/ui'

const services = data.services as Service[]

const allServices = ref<Service[]>(services)
const selectedCategory = ref('Todos')
const searchQuery = ref('')
const visibleCount = ref(12)
const loadMoreTrigger = ref<HTMLElement | null>(null)

// Captura a posição do scroll da página para o botão "Voltar ao topo"
const { y } = useWindowScroll()
const showBackToTop = computed(() => y.value > 400)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// TODO: MUDAR ESSAS CATEGORIAS
const categories = [
  'Todos', 'Construção', 'Instalações Elétricas', 'Hidráulica',
  'Acabamento', 'Piscinas', 'Paisagismo', 'Energia Solar',
  'Vidraçaria', 'Marcenaria'
]

const finalCtaSection: FinalCtaSection = {
  title: 'Não Encontrou o Serviço que Procura?',
  description: 'Temos ainda mais soluções customizadas! Entre em contato para conhecer todas as nossas opções disponíveis.'
}

const items = ref<BreadcrumbItem[]>([
  { label: 'Home', to: '/' },
  { label: 'Serviços' }
])

// Lógica de Filtro (Agora incluindo a Pesquisa)
const filteredServices = computed(() => {
  let result = allServices.value

  // 1. Filtra pela Categoria
  if (selectedCategory.value !== 'Todos') {
    result = result.filter(
      service => service.category.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  // 2. Filtra pela Pesquisa de texto (Nome, Descrição ou Keywords)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(service =>
      service.name.toLowerCase().includes(query)
      || service.description.toLowerCase().includes(query)
      || (service.keywords && service.keywords.some(k => k.toLowerCase().includes(query)))
    )
  }

  return result
})

// Lógica de Paginação (12 em 12)
const visibleServices = computed(() => {
  return filteredServices.value.slice(0, visibleCount.value)
})

// Mapeando do formato do JSON para o formato do Componente
const mappedCards = computed<SolutionCard[]>(() => {
  return visibleServices.value.map(service => ({
    id: service.id,
    type: 'image',
    size: service.size || 'medium',
    title: service.name,
    description: service.description,
    icon: service.icon,
    image: service.image,
    link: `/servico/${service.slug}`
  }))
})

// Resetar paginação ao trocar de categoria
const setCategory = (category: string) => {
  selectedCategory.value = category
  visibleCount.value = 12
}

// Resetar paginação quando o usuário digitar algo novo na pesquisa
watch(searchQuery, () => {
  visibleCount.value = 12
})

// Scroll Infinito
useIntersectionObserver(
  loadMoreTrigger,
  ([isIntersecting]) => {
    if (isIntersecting && visibleCount.value < filteredServices.value.length) {
      // Adiciona um pequeno delay opcional para efeito visual suave
      setTimeout(() => {
        visibleCount.value += 12
      }, 300)
    }
  },
  { threshold: 0.5 }
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
          <h1 class="title-section">
            Explore Nossas Soluções
          </h1>
          <p class="text-gray-600 text-lg">
            Tudo o que sua casa precisa, em um único lugar.
          </p>
        </div>

        <div class="w-full md:max-w-xs">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Buscar serviços..."
            size="lg"
            color="primary"
            variant="outline"
          >
            <template v-if="searchQuery?.length" #trailing>
              <UButton
                color="primary"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click="searchQuery = ''"
              />
            </template>
          </UInput>
        </div>
      </div>

      <UScrollArea
        v-slot="{ item }"
        :items="categories"
        orientation="horizontal"
        class="w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 mb-5 py-2 gap-3"
      >
        <button
          class="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 mx-2"
          :class="[
            selectedCategory === item
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-500 hover:text-orange-500'
          ]"
          @click="setCategory(item)"
        >
          {{ item }}
        </button>
      </UScrollArea>

      <div
        v-if="filteredServices.length === 0"
        class="py-20 text-center flex flex-col items-center justify-center"
      >
        <UIcon name="i-heroicons-magnifying-glass" class="text-gray-300 text-6xl mb-4" />
        <h3 class="text-xl font-medium text-gray-900 mb-2">
          Nenhum serviço encontrado
        </h3>
        <p class="text-gray-500">
          Não encontramos nenhum resultado para "{{ searchQuery }}".
        </p>
        <UButton
          class="mt-4"
          color="primary"
          variant="soft"
          @click="searchQuery = ''; selectedCategory = 'Todos'"
        >
          Limpar filtros
        </UButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          v-for="card in mappedCards"
          :key="card.id"
          :card="card"
          class="min-h-72"
        />
      </div>

      <div
        ref="loadMoreTrigger"
        class="h-20 flex items-center justify-center mt-8"
      >
        <UIcon
          v-if="visibleCount < filteredServices.length"
          name="i-heroicons-arrow-path"
          class="animate-spin text-3xl text-orange-500"
        />
      </div>
    </UContainer>

    <section-final-cta
      :section="finalCtaSection"
    />

    <Transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 z-50 p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
        aria-label="Voltar ao topo"
      >
        <UIcon name="i-heroicons-arrow-up-20-solid" class="text-2xl block" />
      </button>
    </Transition>
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

/* Transição do botão flutuante */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
