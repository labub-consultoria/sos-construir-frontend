<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const {
  selectedCategories,
  selectedBrands,
  searchQuery,
  sortBy,
  currentPage,
  products,
  total,
  totalPages,
  brands,
  categories,
  loading,
  limit,
  clearFilters,
  clearSearch,
  hasActiveFilters,
} = useCatalog()

const sortOptions = [
  { label: 'Relevância', value: 'relevance' },
  { label: 'Menor preço', value: 'price-asc' },
  { label: 'Maior preço', value: 'price-desc' },
  { label: 'Melhor avaliação', value: 'rating' },
]

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Catálogo' },
]

useSeoMeta({
  title: 'Catálogo de Materiais',
  description:
    'Materiais direto da fábrica, preço justo e qualidade garantida. Tintas, cerâmicas, revestimentos, pisos e muito mais para sua obra.',
})

// sidebar
const categoryItems = computed(() =>
  categories.value.map((c) => ({ label: c.name, value: c.slug, count: c.count }))
)

const brandItems = computed(() => {
  return brands.value.map((b) => ({
    label: b.name,
    value: b.slug,
    count: b.count || 0
  }))
})

</script>

<template>
  <div class="min-h-screen bg-gray-50/30 pt-8 pb-20">
    <UContainer>
      <div class="mb-6">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="title-section mt-1 mb-2">Materiais Para Sua Obra</h1>
        <p class="text-slate-500 text-lg">
          Trabalhamos com as principais marcas do mercado. Materiais direto da fábrica, preço justo
          e qualidade garantida para sua obra.
        </p>
      </div>

      <!-- Search + Sort -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Procure por nome, marca, categoria..." size="lg" color="primary" variant="outline"
          class="flex-1 shadow-sm">
          <template v-if="searchQuery?.length" #trailing>
            <UButton color="primary" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
              @click="clearSearch" />
          </template>
        </UInput>

        <USelect v-model="sortBy" :items="sortOptions" value-key="value" label-key="label" size="lg"
          class="sm:w-52 shadow-sm" placeholder="Ordenar por" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- SIDEBAR -->
        <aside class="lg:col-span-3 space-y-8 pr-2">
          <div class=" flex content-center">
            <UButton v-if="hasActiveFilters" variant="link" class="font-semibold" @click="clearFilters"
              icon="i-heroicons-arrow-path">
              Limpar Todos os Filtros
            </UButton>
          </div>

          <div class="space-y-4">
            <h3 class="font-bold text-blue-500 text-lg">Categoria</h3>

            <UCheckboxGroup v-model="selectedCategories" :items="categoryItems" color="primary" :ui="{
              wrapper: 'space-y-4',
              legend: 'sr-only'
            }">
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

          <div v-if="brandItems.length" class="space-y-4 border-t border-gray-100 pt-8">
            <h3 class="font-bold text-blue-500 text-lg">Marcas</h3>

            <UCheckboxGroup v-model="selectedBrands" :items="brandItems" color="primary" :ui="{
              wrapper: 'space-y-4',
              legend: 'sr-only'
            }">
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

        </aside>

        <!-- GRID -->
        <div class="lg:col-span-9 flex flex-col gap-8">

          <!-- Resultado -->
          <p v-if="!loading" class="text-sm text-gray-500">
            {{ total }} {{ total === 1 ? 'produto encontrado' : 'produtos encontrados' }}
          </p>

          <!-- Skeleton -->
          <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-5">
            <div v-for="i in limit" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <USkeleton class="h-48 w-full" />
              <div class="p-4 space-y-3">
                <USkeleton class="w-1/3 h-3" />
                <USkeleton class="w-full h-5" />
                <USkeleton class="w-2/3 h-4" />
                <USkeleton class="w-1/3 h-6" />
              </div>
            </div>
          </div>

          <!-- Grid de produtos -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-5">
            <NuxtLink v-for="product in products" :key="product.id" :to="`/catalogo/${product.slug}`"
              class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
              <div class="relative h-48 overflow-hidden">
                <NuxtImg :src="product.image" :alt="product.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span
                  class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-gray-100">
                  {{ product.category.replace(/-/g, ' ') }}
                </span>
              </div>

              <div class="p-4 flex flex-col flex-1">
                <span class="text-xs text-gray-400 font-medium mb-1">{{ product.brand }}</span>

                <h3
                  class="font-bold text-blue-500 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                  {{ product.title }}
                </h3>

                <p class="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                  {{ product.description }}
                </p>

                <!-- Rating -->
                <div v-if="product.rating" class="flex items-center gap-1.5 mb-3">
                  <div class="flex">
                    <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-3 h-3"
                      :class="i <= Math.round(product.rating) ? 'text-orange-400' : 'text-gray-200'" />
                  </div>
                  <span class="text-xs text-gray-400">({{ product.reviewCount }})</span>
                </div>

                <!-- Preço -->
                <div v-if="product.price" class="flex items-baseline gap-1 mt-auto">
                  <span class="text-lg font-bold text-blue-500">
                    R$ {{ product.price.toFixed(2).replace('.', ',') }}
                  </span>
                  <span v-if="product.priceUnit" class="text-xs text-gray-400 font-medium">
                    {{ product.priceUnit }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Paginação -->
          <div v-if="!loading && totalPages > 1"
            class="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-6">
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
