<script setup lang="ts">
import { ref, onMounted } from 'vue'

const defaultSection: BaseSection = {
  title: 'Dicas e Novidades de Construção',
}
const props = defineProps<{
  section?: Partial<BaseSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))
const posts = ref<BlogPost[]>([])
const loading = ref(true)

// TODO: PASSAR PRA SERVER
const fetchPosts = async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 800))
  posts.value = [
    {
      id: 1,
      image:
        '/images/blog/cover-2.jpg',
      category: 'DICAS VALIOSAS',
      title: 'Planejamento: O Segredo de uma Obra de Sucesso',
      link: '/blog/1',
    },
    {
      id: 2,
      image:
        '/images/blog/cover-1.jpg',
      category: 'REFORMA',
      title: 'Como Fazer um Muro de Arrimo Seguro',
      link: '/blog/2',
    },
    {
      id: 3,
      image:
        '/images/blog/cover-3.jpg',
      category: 'MANUTENÇÃO',
      title: 'Como Evitar Infiltrações na Sua Casa?',
      link: '/blog/3',
    },
    {
      id: 4,
      image:
        '/images/blog/cover-4.jpg',
      category: 'TENDÊNCIAS',
      title: 'Cores que Vão Dominar as Reformas em 2026',
      link: '/blog/4',
    },
  ]
  loading.value = false
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <section class="py-16 md:py-24 w-full overflow-hidden" :class="section?.bgSection">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="text-center mb-12">
        <span class="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3"> BLOG </span>
        <h2 class="text-3xl md:text-4xl font-bold text-blue-500 tracking-tight">
          {{ section.title }}
        </h2>
      </div>

      <div v-if="loading" class="flex gap-6 overflow-hidden">
        <div v-for="i in 3" :key="i"
          class="w-[300px] md:w-[350px] shrink-0 bg-white border border-gray-100 rounded-2xl h-[400px] basis-1/3">
          <USkeleton class="h-48 w-full" />
          <div class="p-6 space-y-4">
            <USkeleton class="w-1/3 h-3" />
            <USkeleton class="w-full h-6" />
            <USkeleton class="w-2/3 h-6" />
          </div>
        </div>
      </div>

      <div>
        <UCarousel v-slot="{ item }" loop wheel-gestures :autoplay="{ delay: 5000 }" :items="posts"
          :ui="{ item: 'basis-2/3 md:basis-1/3' }">
          <BlogCard :post="item" class="my-1" />
        </UCarousel>
      </div>
    </div>
  </section>
</template>
