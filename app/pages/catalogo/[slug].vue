<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const slug = route.params.slug as string

const { product, relatedProducts, error } = useProduct(slug)

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, fatal: true })
}

// SEO
useSeoMeta({
  title: () => `${product.value?.title} | Catálogo`,
  description: () => product.value?.description,
  ogTitle: () => product.value?.title,
  ogImage: () => product.value?.image,
  ogDescription: () => product.value?.description,
})

const categoryLabel = computed(() =>
  product.value?.category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
)

const formattedPrice = computed(() => {
  if (!product.value?.price) return null
  return `R$ ${product.value.price.toFixed(2).replace('.', ',')}`
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Home', to: '/' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: categoryLabel.value, to: `/catalogo?category=${product.value?.category}` },
  { label: product.value?.title },
])

const ctaText = computed(() =>
  WHATSAPP_MESSAGE + ' Com o Produto: ' + product.value?.title
)

</script>

<template>
  <div v-if="product" class="min-h-screen bg-gray-50/30 pt-8 pb-20">
    <UContainer>
      <div class="mb-8">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">

        <!-- Imagem -->
        <div class="lg:col-span-5">
          <div class="rounded-2xl overflow-hidden aspect-square bg-white border border-gray-100 shadow-sm">
            <NuxtImg :src="product.image" :alt="product.title" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Info -->
        <div class="lg:col-span-7 flex flex-col gap-6">

          <!-- Categoria + marca -->
          <div class="flex items-center gap-3">
            <NuxtLink :to="`/catalogo?category=${product.category}`"
              class="px-3 py-1 bg-orange-50 text-orange-500 text-xs font-bold uppercase tracking-widest rounded-full border border-orange-100 hover:bg-orange-100 transition-colors">
              {{ categoryLabel }}
            </NuxtLink>
            <span v-if="product.brand" class="text-sm text-gray-400 font-medium">
              {{ product.brand }}
            </span>
          </div>

          <h1 class="title-section leading-tight">{{ product.title }}</h1>

          <!-- Rating -->
          <div v-if="product.rating" class="flex items-center gap-2">
            <div class="flex">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-4 h-4"
                :class="i <= Math.round(product.rating) ? 'text-orange-400' : 'text-gray-200'" />
            </div>
            <span class="text-sm font-semibold text-blue-500">{{ product.rating }}</span>
            <span class="text-sm text-gray-400">({{ product.reviewCount }} avaliações)</span>
          </div>

          <p class="text-slate-500 text-lg leading-relaxed">{{ product.description }}</p>

          <!-- Preço -->
          <div v-if="formattedPrice" class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-blue-500">{{ formattedPrice }}</span>
            <span v-if="product.priceUnit" class="text-gray-400 font-medium">
              {{ product.priceUnit }}
            </span>
          </div>

          <USeparator />

          <!-- CTA -->
          <div class="flex flex-col gap-3">
            <UButton :to="formatWhatsappLink(PHONENUMBER, ctaText)" target="_blank" color="primary" size="xl"
              class="font-bold shadow-md" block>
              Solicitar orçamento via WhatsApp
            </UButton>
            <p class="text-xs text-gray-400 text-center">
              Nossa equipe responde em até 24 horas úteis
            </p>
          </div>

          <!-- Detalhes rápidos -->
          <UCard class="bg-white border border-gray-100">
            <ul class="space-y-3">
              <li class="flex items-center gap-3 text-sm">
                <UIcon name="i-heroicons-tag" class="w-4 h-4 text-orange-500 shrink-0" />
                <span class="text-gray-500">Categoria</span>
                <span class="ml-auto font-semibold text-blue-500">{{ categoryLabel }}</span>
              </li>
              <li v-if="product.brand" class="flex items-center gap-3 text-sm">
                <UIcon name="i-heroicons-building-storefront" class="w-4 h-4 text-orange-500 shrink-0" />
                <span class="text-gray-500">Marca</span>
                <span class="ml-auto font-semibold text-blue-500">{{ product.brand }}</span>
              </li>
              <li v-if="product.priceUnit" class="flex items-center gap-3 text-sm">
                <UIcon name="i-heroicons-calculator" class="w-4 h-4 text-orange-500 shrink-0" />
                <span class="text-gray-500">Unidade</span>
                <span class="ml-auto font-semibold text-blue-500">{{ product.priceUnit }}</span>
              </li>
            </ul>
          </UCard>
        </div>
      </div>

      <!-- Produtos relacionados -->
      <div v-if="relatedProducts?.data">
        <h2 class="font-bold text-blue-500 text-2xl mb-6">Produtos relacionados</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
          <NuxtLink v-for="related in relatedProducts.data" :key="related.id" :to="`/catalogo/${related.slug}`"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
            <div class="h-40 overflow-hidden">
              <NuxtImg :src="related.image" :alt="related.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-4 flex flex-col flex-1">
              <span class="text-xs text-gray-400 mb-1">{{ related.brand }}</span>
              <h3
                class="font-bold text-blue-500 text-sm leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
                {{ related.title }}
              </h3>
              <div v-if="related.price" class="flex items-baseline gap-1 mt-auto">
                <span class="font-bold text-blue-500">
                  R$ {{ related.price.toFixed(2).replace('.', ',') }}
                </span>
                <span v-if="related.priceUnit" class="text-xs text-gray-400">
                  {{ related.priceUnit }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

    </UContainer>
  </div>
</template>
