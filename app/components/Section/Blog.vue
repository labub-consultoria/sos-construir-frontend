<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BaseSection } from '~/types/sections'
import type { BlogPost } from '~/types/blogPost'

const _props = defineProps<{
  section?: BaseSection
}>()

const posts = ref<BlogPost[]>([])
const loading = ref(true)

// Mock
const fetchPosts = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  posts.value = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
      category: 'DICAS VALIOSAS',
      title: 'Planejamento: O Segredo de uma Obra de Sucesso',
      link: '#'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
      category: 'REFORMA',
      title: 'Como Fazer um Muro de Arrimo Seguro',
      link: '#'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=800&auto=format&fit=crop',
      category: 'MANUTENÇÃO',
      title: 'Como Evitar Infiltrações na Sua Casa?',
      link: '#'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356f90?q=80&w=800&auto=format&fit=crop',
      category: 'TENDÊNCIAS',
      title: 'Cores que Vão Dominar as Reformas em 2026',
      link: '#'
    }
  ]
  loading.value = false
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <section
    class="py-16 md:py-24 w-full overflow-hidden"
    :class="section?.bgSection"
  >
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="text-center mb-12">
        <span class="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3">
          BLOG
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-blue-500 tracking-tight">
          {{ section?.title || 'Dicas e Novidades de Construção' }}
        </h2>
      </div>

      <div
        v-if="loading"
        class="flex gap-6 overflow-hidden"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="w-[300px] md:w-[350px] shrink-0 bg-white border border-gray-100 rounded-2xl h-[400px] basis-1/3"
        >
          <USkeleton class="h-48 w-full" />
          <div class="p-6 space-y-4">
            <USkeleton class="w-1/3 h-3" />
            <USkeleton class="w-full h-6" />
            <USkeleton class="w-2/3 h-6" />
          </div>
        </div>
      </div>

      <div>
        <UCarousel
          v-slot="{ item }"
          loop
          wheel-gestures
          :autoplay="{ delay: 5000 }"
          :items="posts"
          :ui="{ item: 'basis-1/3' }"
        >
          <BlogCard
            :post="item"
            class="my-1"
          />
        </UCarousel>
      </div>
    </div>
  </section>
</template>
