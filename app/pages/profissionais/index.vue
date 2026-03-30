<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const {
  searchQuery,
  selectedSpecialty,
  minRating,
  sortBy,
  currentPage,
  professionals,
  total,
  totalPages,
  loading,
  limit,
  specialtyFacets,
  clearFilters,
  hasActiveFilters,
} = useProfessionals()

const sortOptions = [
  { label: 'Relevância', value: 'relevance' },
  { label: 'Maior avaliação', value: 'rating' },
  { label: 'Mais obras realizadas', value: 'jobs' },
  { label: 'Mais experientes', value: 'experience' },
]

const items: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Profissionais' },
]

const seoTitle = 'Profissionais de Construção e Reforma em Foz do Iguaçu'
const seoDescription = 'Encontre pintores, eletricistas, pedreiros, encanadores e muito mais. Profissionais verificados, com garantia integral e histórico real de obras em Foz do Iguaçu e região.'
const seoKeywords = 'profissionais de construção Foz do Iguaçu, pedreiro Foz do Iguaçu, pintor Foz do Iguaçu, eletricista Foz do Iguaçu, encanador Foz do Iguaçu, reforma residencial, mão de obra qualificada, profissionais verificados, SOS Construir'

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  keywords: seoKeywords,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: '/images/og-profissionais.jpg',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: seoTitle,
    description: seoDescription,
  }),
])

const specialties = computed(() =>
  specialtyFacets.value.map((f) => ({ label: f.name, value: f.name, count: f.count })).slice(0, 10)
)
const ratingOptions = [
  { label: 'Qualquer', value: '0' },
  { label: '4.0 ou mais', value: '4' },
  { label: '3.0 ou mais', value: '3' },
]

</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] pt-8 pb-20">
    <UContainer>

      <div class="text-sm text-gray-500 mb-6 flex gap-2 items-center">
        <UBreadcrumb :items="items" />
      </div>
      <!-- Header -->
      <div class="mb-10">
        <h1 class="title-section mt-1 mb-3">
          Nossos Profissionais Especializados
        </h1>
        <p class="text-slate-500 text-lg leading-relaxed">
          Escolha entre mais de 100 profissionais certificados para a sua obra.
          Todos verificados, com garantia integral e histórico real de entregas.
        </p>
      </div>

      <!-- Search + Sort -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Buscar profissional ou serviço" size="lg" color="primary" variant="outline" class="w-full">
          <template v-if="searchQuery?.length" #trailing>
            <UButton color="primary" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
              @click="searchQuery = ''" />
          </template>
        </UInput>
        <USelect v-model="sortBy" :items="sortOptions" value-key="value" label-key="label" size="lg"
          class="sm:w-52 shadow-sm" placeholder="Ordenar por" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- SIDEBAR -->
        <aside class="lg:col-span-3 space-y-8 pr-2">

          <!-- Limpar Filtros -->
          <div class="flex content-center">
            <UButton v-if="hasActiveFilters" variant="link" class="font-semibold" icon="i-heroicons-arrow-path"
              @click="clearFilters">
              Limpar Todos os Filtros
            </UButton>
          </div>

          <!-- Especialidade -->
          <div class="space-y-4">
            <h3 class="font-bold text-blue-500 text-lg">Especialidade</h3>
            <UCheckboxGroup v-model="selectedSpecialty" :items="specialties" color="primary"
              :ui="{ wrapper: 'space-y-4', legend: 'sr-only' }">
              <template #label="{ item }">
                <div class="flex items-center justify-between w-full flex-1 cursor-pointer">
                  <span class="text-sm text-gray-600">{{ item.label }}</span>
                  <span
                    class="text-xs bg-gray-50 border border-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium ml-3">
                    {{ item.count }}
                  </span>
                </div>
              </template>
            </UCheckboxGroup>
          </div>

          <!-- Avaliação Mínima -->
          <div class="space-y-4 border-t border-gray-100 pt-6">
            <h3 class="font-bold text-blue-500 text-lg">Avaliação Mínima</h3>
            <URadioGroup v-model="minRating" :items="ratingOptions" value-key="value" color="primary"
              :ui="{ wrapper: 'space-y-3' }">
              <template #label="{ item }">
                <div class="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <span v-if="item.value === '0'">{{ item.label }}</span>
                  <div v-else class="flex items-center gap-1">
                    <div class="flex text-orange-400">
                      <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-4 h-4"
                        :class="i <= Number(item.value) ? 'text-orange-400' : 'text-gray-200'" />
                    </div>
                    <span class="text-gray-400 text-xs ml-1">{{ item.label }}</span>
                  </div>
                </div>
              </template>
            </URadioGroup>
          </div>

        </aside>

        <!-- GRID -->
        <div class="lg:col-span-9 flex flex-col gap-8">

          <!-- Header de Resultados e Ordenação -->
          <p v-if="!loading" class="text-sm text-gray-500">
            {{ total }} {{ total === 1 ? 'produto encontrado' : 'produtos encontrados' }}
          </p>
          <!-- Skeleton Loading -->
          <div v-if="loading" class="flex flex-col gap-6">
            <div v-for="i in limit" :key="i" class="bg-white rounded-2xl border border-gray-100 p-6">
              <USkeleton class="h-40 w-full" />
            </div>
          </div>

          <!-- Lista de Profissionais -->
          <div v-else class="flex flex-col gap-6">
            <ProfessionalCard v-for="prof in professionals" :key="prof.id" :professional="prof"
              :to="'/profissionais/' + prof.id" />
          </div>

          <!-- Paginação -->
          <div v-if="!loading && totalPages > 1"
            class="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-6">
            <p class="text-sm text-gray-500 mb-4 sm:mb-0">
              Página {{ currentPage }} de {{ totalPages }}
            </p>
            <UPagination v-model:page="currentPage" :items-per-page="limit" :total="total" />
          </div>

        </div>
      </div>
    </UContainer>
  </div>
</template>
