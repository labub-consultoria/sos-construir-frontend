<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const {
  searchQuery,
  selectedCategory,
  currentPage,
  posts,
  total,
  totalPages,
  loading,
  limit,
  setCategory,
} = useBlogIndex()

const categories = [
  { name: 'Todos', slug: 'todos' },
  { name: 'Construção', slug: 'construcao' },
  { name: 'Reformas', slug: 'reformas' },
  { name: 'Acabamento', slug: 'acabamento' },
  { name: 'Materiais', slug: 'materiais' },
  { name: 'Planejamento', slug: 'planejamento' },
]

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Blog' },
]

useSeoMeta({
  title: 'Blog | Dicas de Construção e Reforma - SOS Construir',
  description: 'Acompanhe nossos artigos com dicas, guias e tendências sobre construção civil, reformas, materiais e planejamento de obras.',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50/30 pt-8 pb-20">
    <UContainer>
      <div class="text-sm text-gray-500 mb-6 flex gap-2 items-center">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div class="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="md:max-w-[60%]">
          <h1 class="title-section">Guias e Dicas Práticas Para Sua Obra</h1>
          <p class="text-slate-500 text-lg">
            Acompanhe conteúdos sobre construção, reforma, acabamento, planejamento, materiais e manutenção.
          </p>
        </div>
        <div class="w-full h-full md:max-w-md flex items-end">
          <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Buscar artigos..."
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

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div class="lg:col-span-8 flex flex-col">

          <!-- Skeleton -->
          <div v-if="loading" class="grid md:grid-cols-2 gap-8 mb-12">
            <div v-for="i in limit" :key="i" class="bg-white rounded-2xl border border-gray-100 h-[420px]">
              <USkeleton class="h-56 w-full rounded-t-2xl" />
              <div class="p-6 space-y-4">
                <USkeleton class="w-1/4 h-4" />
                <USkeleton class="w-full h-6" />
                <USkeleton class="w-3/4 h-6" />
                <USkeleton class="w-full h-4" />
                <USkeleton class="w-2/3 h-4" />
              </div>
            </div>
          </div>

          <!-- Posts -->
          <div v-else class="grid md:grid-cols-2 gap-8 mb-12">
            <BlogCard variant="article" v-for="post in posts" :post="post" :key="post.slug" />
          </div>

          <div class="mt-auto flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-6">
            <p class="text-sm text-gray-500 mb-4 sm:mb-0">
              Página {{ currentPage }} de {{ totalPages }}
            </p>
            <UPagination v-model:page="currentPage" :items-per-page="limit" :total="total" />
          </div>
        </div>

        <aside class="lg:col-span-4 space-y-8">
          <UCard class="bg-white border border-gray-200">
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
