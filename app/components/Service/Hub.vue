<script setup lang="ts">
import { useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core'

import type { BreadcrumbItem } from '@nuxt/ui'
import categoriesData from '@/data/servicesCategories.json'
import servicesData from '@/data/services.json'

// Hub de serviços parametrizado por trilho: /servicos (execução) e as rotas de trilho
// renderizam este mesmo componente — quatro páginas copiadas com um filtro diferente
// seria a forma errada de fazer a coisa certa.

const props = defineProps<{ type: ServiceType }>()

interface Trilho {
  label: string
  type: ServiceType
  to: string
  gridTitle: string
  gridSubtitle: string
}

const TRILHOS: Trilho[] = [
  {
    // "Execução" é o nome interno do trilho (type/slug); para o cliente é mão de obra.
    label: 'Mão de Obra',
    type: 'execucao',
    to: '/servicos',
    gridTitle: 'Mão de Obra',
    gridSubtitle: 'Encontre o profissional certo para cada etapa da sua obra.',
  },
  {
    label: 'Locação',
    type: 'locacao',
    to: '/servicos/locacao',
    gridTitle: 'Serviços de Locação',
    gridSubtitle: 'O equipamento certo, pelo tempo certo da sua obra.',
  },
  {
    label: 'Materiais',
    type: 'material',
    to: '/servicos/materiais',
    gridTitle: 'Materiais',
    gridSubtitle: 'Materiais direto da fábrica para a sua obra.',
  },
  {
    label: 'Projetos',
    type: 'projeto',
    to: '/servicos/projetos',
    gridTitle: 'Projetos',
    gridSubtitle: 'Do projeto técnico à aprovação, com quem entende.',
  },
]

// Aba com contagem zero é promessa do que não há: o trilho só aparece quando tiver
// ao menos um serviço. Materiais e Projetos surgem sozinhos quando os serviços entrarem.
const counts = servicesData.services.reduce<Record<string, number>>((acc, s) => {
  acc[s.type] = (acc[s.type] ?? 0) + 1
  return acc
}, {})

const tabs = TRILHOS.filter((t) => (counts[t.type] ?? 0) > 0)
const activeTrilho = computed(() => TRILHOS.find((t) => t.type === props.type)!)

const breadcrumbItems = computed<BreadcrumbItem[]>(() =>
  props.type === 'execucao'
    ? [{ label: 'Home', to: '/' }, { label: 'Serviços' }]
    : [{ label: 'Home', to: '/' }, { label: 'Serviços', to: '/servicos' }, { label: activeTrilho.value.label }],
)

useBreadcrumbSchema(breadcrumbItems.value)

// Subdivisão por categoria só existe na Execução; os outros trilhos têm poucos serviços.
const categories = [{ name: 'Todos', slug: 'todos' }, ...categoriesData.categories] as Category[]
const showCategories = computed(() => props.type === 'execucao')

const loadMoreTrigger = useTemplateRef('loadMoreTrigger')

const {
  visibleCount,
  selectedCategory,
  visibleServices,
  totalServices,
  pending,
  isAppending,
  pageSize,
  setCategory,
  loadMore,
} = useServices(props.type)

// Busca rápida em linguagem de cliente: clicar preenche o campo e abre o dropdown.
// A lista canônica é coberta pelo teste do catálogo (chip nunca leva a busca vazia).
const quickSearches = QUICK_SEARCHES

// A busca leva para fora da página; a grade e as abas não mudam durante ela.
const handleSelect = (slug: string) => {
  navigateTo(slug ? `/servicos/${slug}` : '/servicos')
}

const finalCtaSection: FinalCtaSection = {
  title: 'Não Encontrou o Serviço que Procura?',
  description:
    'Temos ainda mais soluções customizadas! Entre em contato para conhecer todas as nossas opções disponíveis.',
}

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

// Trocando a lista (ver `isAppending`): grade inteira vira skeleton.
const isReplacingList = computed(() => pending.value && !isAppending.value)

// Acrescentando: mantém os cards atuais e enfileira skeletons dos que faltam,
// evitando o salto de layout quando os dados chegam.
const incomingCount = computed(() =>
  isAppending.value && pending.value ? Math.max(0, visibleCount.value - mappedCards.value.length) : 0
)

const resultsRef = useTemplateRef('resultsRef')
const reducedMotion = usePreferredReducedMotion()

// Traz o topo dos resultados de volta ao trocar de categoria — a grade muda abaixo
// da dobra e o clique não teria efeito visível. Só sobe (guarda do `top < 0`) para
// não empurrar o herói de quem está no começo.
const selectCategory = (slug: string) => {
  setCategory(slug)

  const results = resultsRef.value
  if (!results || results.getBoundingClientRect().top >= 0) return

  results.scrollIntoView({
    behavior: reducedMotion.value === 'reduce' ? 'auto' : 'smooth',
    block: 'start'
  })
}

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
  <div class="min-h-screen bg-white relative">
    <!-- Herói: o campo de busca domina a primeira dobra -->
    <section class="relative bg-[#0b2258] pt-8 pb-16 sm:pb-24 overflow-hidden">
      <!-- Grid Background -->
      <div class="absolute inset-0 z-0 opacity-3 pointer-events-none" style="background-image: linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px); background-size: 40px 40px;"></div>
      
      <UContainer class="relative z-10 flex flex-col items-center text-center">
        <div class="self-start text-sm mb-6 flex gap-2 items-center">
          <UBreadcrumb :items="breadcrumbItems" :ui="{
            link: 'text-blue-100/60 hover:text-white',
            separatorIcon: 'text-blue-100/40',
          }" />
        </div>

        <!-- nowrap na linha laranja: sem ele, "hoje?" quebra viúvo numa 3ª linha no mobile.
             text-3xl no mobile: a linha nowrap tem que caber em 320px — maior, o
             overflow-hidden da section corta as pontas do texto sem dar scroll. -->
        <h1 class="text-3xl sm:text-6xl font-extrabold text-white mb-6">
          O que a sua casa <br>
          <span class="text-orange-500 whitespace-nowrap inline-block mt-1 sm:mt-2">está precisando hoje?</span>
        </h1>
        <p class="text-blue-100/80 text-sm sm:text-xl mb-8 sm:mb-10">
          Conte do seu jeito que a gente encontra quem faz
        </p>

        <ServiceSearch class="max-w-3xl lg:max-w-4xl" :show-all-services-link="false"
          :quick-searches="quickSearches" @select="handleSelect" />
      </UContainer>
    </section>

    <!-- Abas de trilho: navegação secundária — são links com visual de aba, não tablist,
         para o leitor de tela não prometer navegação por setas que não existe -->
    <div class="border-b border-gray-200">
      <UContainer>
        <nav aria-label="Trilhos de serviço" class="no-scrollbar flex gap-6 overflow-x-auto pt-4">
          <NuxtLink v-for="tab in tabs" :key="tab.type" :to="tab.to"
            :aria-current="tab.type === type ? 'page' : undefined"
            class="flex shrink-0 items-center gap-2 border-b-2 pb-3 pt-1 text-sm transition-colors" :class="tab.type === type
              ? 'border-orange-500 font-semibold text-blue-950'
              : 'border-transparent text-gray-500 hover:text-blue-950'">
            {{ tab.label }}
            <span class="rounded-full px-2 py-0.5 text-xs"
              :class="tab.type === type ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'">
              {{ counts[tab.type] }}
            </span>
          </NuxtLink>
        </nav>
      </UContainer>
    </div>

    <!-- GRID -->
    <UContainer>
      <div ref="resultsRef" class="min-h-96 scroll-mt-24 py-10">
        <div class="mb-5">
          <!-- No mobile o h1 do herói desce a 30px (limite do nowrap em 320px); o h2 da
               seção fica um degrau abaixo para a hierarquia da página não inverter. -->
          <h2 class="title-section max-sm:text-2xl">{{ activeTrilho.gridTitle }}</h2>
          <p class="text-gray-600 text-base sm:text-lg">{{ activeTrilho.gridSubtitle }}</p>
        </div>

        <UScrollArea v-if="showCategories" v-slot="{ item }" :items="categories" orientation="horizontal"
          class="w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 mb-5 py-2 gap-3">
          <button
            class="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 mx-2"
            :class="[
              selectedCategory === item.slug
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-500 hover:text-orange-500',
            ]" @click.stop="selectCategory(item.slug)">
            {{ item.name }}
          </button>
        </UScrollArea>

        <div v-if="!pending && totalServices === 0" class="py-20 text-center text-gray-500">
          Ainda não há serviços neste trilho.
        </div>

        <div v-else :aria-busy="pending" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-8">
          <template v-if="isReplacingList">
            <USkeleton v-for="i in pageSize" :key="`sk-${i}`" class="h-[280px] md:h-[240px] rounded-2xl" />
          </template>

          <template v-else>
            <ServiceCard v-for="(card, index) in mappedCards" :key="card.id" :card="card"
              :priority="index < 3" class="min-h-72" />
            <USkeleton v-for="i in incomingCount" :key="`sk-more-${i}`"
              class="h-[280px] md:h-[240px] rounded-2xl" />
          </template>
        </div>

        <p v-if="pending" role="status" class="sr-only">Carregando serviços</p>

        <div v-show="visibleCount < totalServices || pending" ref="loadMoreTrigger" class="py-8" />
      </div>
    </UContainer>

    <section-final-cta :section="finalCtaSection" />
  </div>
</template>

<style scoped>
/* Esconder scrollbar na lista de abas no mobile */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
