<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const slug = route.params.slug as string
const postContent = useTemplateRef('post-content')

const { post, relatedPosts, error } = useBlogPost(slug)

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, fatal: true })
}
// SEO
useSeoMeta({
  title: () => `${post.value?.title}`,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogImage: () => post.value?.coverImage,
  ogDescription: () => post.value?.description
})


const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: post.value?.title ?? '' },
])

const scrollToContent = () => {
  postContent.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div v-if="post" class="min-h-screen bg-gray-50/30 pt-8 pb-20">
    <UContainer>
      <div class="mb-8">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article class="lg:col-span-8">
          <header class="mb-10 flex flex-col gap-5">
            <h1 class="title-section">
              {{ post.title }}
            </h1>
            <p class="text-lg text-slate-500 leading-relaxed mb-2">
              {{ post.description }}
            </p>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-orange-500" />
                {{ post.date }}
              </span>
              <span class="flex items-center gap-2">
                <UIcon name="i-heroicons-clock" class="w-4 h-4 text-orange-500" />
                Leitura de {{ post.readingTime }}
              </span>
              <span class="flex items-center gap-2">
                <UIcon name="i-heroicons-user" class="w-4 h-4 text-orange-500" />
                {{ post.author }}
              </span>
            </div>

            <UCard class="flex lg:hidden bg-white border border-gray-200">
              <h3 class="font-bold text-blue-500 text-xl mb-4">Resumo do artigo</h3>
              <p class="text-slate-500 leading-relaxed mb-6">{{ post.summary }}</p>
              <button @click="scrollToContent"
                class="text-orange-500 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors">
                Ler conteúdo completo
                <UIcon name="i-heroicons-arrow-down" class="w-4 h-4" />
              </button>
            </UCard>
          </header>

          <NuxtImg :src="post.coverImage" :alt="post.title"
            class="w-full h-[400px] object-cover rounded-2xl mb-12 shadow-sm" />

          <div ref="post-content" class="space-y-12">
            <section v-for="(section, index) in post.content" :key="index" class="space-y-6">
              <h2 v-if="section.title" class="title-section md:text-4xl text-blue-500">
                {{ section.title }}
              </h2>

              <p v-for="(paragraph, pIndex) in section.paragraphs" :key="pIndex"
                class="text-slate-500 leading-relaxed text-lg">
                {{ paragraph }}
              </p>
              <div class="w-full flex justify-center my-2">
                <NuxtImg v-if="section.image" :src="section.image" lazy :alt="section.title || 'Imagem do artigo'"
                  class="h-96 rounded-2xl shadow-sm" />
              </div>

              <blockquote v-if="section.quote" class="bg-[#EDF6FA] border-l-orange-500 border-l-4 p-8 rounded-2xl my-8">
                <p class="text-xl font-medium text-blue-500 leading-tight text-center italic">
                  {{ section.quote }}
                </p>
              </blockquote>

              <template v-if="section.paragraphsAfterQuote">
                <p v-for="(paragraph, pIndex) in section.paragraphsAfterQuote" :key="`after-${pIndex}`"
                  class="text-slate-500 leading-relaxed text-lg">
                  {{ paragraph }}
                </p>
              </template>
            </section>
          </div>
        </article>

        <aside class="lg:col-span-4 space-y-8">
          <UCard class="hidden lg:flex bg-white border border-gray-200">
            <h3 class="font-bold text-blue-500 text-xl mb-4">Resumo do artigo</h3>
            <p class="text-gray-600 text-sm leading-relaxed mb-6">{{ post.summary }}</p>
            <button @click="scrollToContent"
              class="text-orange-500 font-semibold text-sm flex items-center gap-2 hover:text-orange-600 transition-colors">
              Ler conteúdo completo
              <UIcon name="i-heroicons-arrow-down" class="w-4 h-4" />
            </button>
          </UCard>

          <UCard class="bg-white border border-gray-200">
            <h3 class="font-bold text-blue-500 text-xl mb-6">Posts relacionados</h3>
            <div class="space-y-6">
              <NuxtLink v-for="related in relatedPosts" :key="related.slug" :to="`/blog/${related.slug}`"
                class="flex gap-4 group">
                <NuxtImg :src="related.image" :alt="related.title"
                  class="w-23 h-24 object-cover rounded-lg shrink-0 group-hover:opacity-80 transition-opacity" />
                <div class="flex flex-col justify-center">
                  <h4
                    class="font-semibold text-blue-500 leading-snug group-hover:text-orange-500 transition-colors line-clamp-2">
                    {{ related.title }}
                  </h4>
                  <span class="text-xs text-gray-500 mt-1">Leitura de {{ related.readingTime }}</span>
                </div>
              </NuxtLink>
            </div>
          </UCard>

          <UCard class="bg-white border border-gray-200">
            <h3 class="font-bold text-blue-500 text-xl mb-6">Categorias</h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink v-for="cat in post.categories" :key="cat.slug" :to="`/blog?categoria=${cat.slug}`"
                class="px-4 py-2 bg-section-bg-1 hover:bg-orange-50 text-gray-600 hover:text-orange-600 text-sm font-semibold rounded-full transition-colors border border-gray-100">
                {{ cat.name }}
              </NuxtLink>
            </div>
          </UCard>

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


<style scoped>
/* Ajuste fino para os blocos de texto não ficarem muito colados */
p+p {
  margin-top: 1.5rem;
}
</style>