<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type Testimonial from '~/types/testimonial'
import type { BaseSection } from '~/types/sections'

const defaultSection: BaseSection = {
  kicker: 'RESULTADOS QUE FALAM POR SI',
  title: 'Clientes que confiam na SOS',
}
const props = defineProps<{
  section?: Partial<BaseSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))

const testimonials = ref<Testimonial[]>([])
const loading = ref(true)

const fetchTestimonials = async () => {
  loading.value = true

  // Simulando delay de rede de 1 segundo
  await new Promise((resolve) => setTimeout(resolve, 1000))

  testimonials.value = [
    {
      id: 1,
      text: 'Atendimento, Profissionalismo, Qualidade, Valor acessível! Reformaram minha cozinha inteira.',
      authorName: 'Patricia Wionczak',
      serviceType: 'Reforma Cozinha',
    },
    {
      id: 2,
      text: 'Trabalho impecável e entregue antes do prazo. O pintor foi super cuidadoso com os móveis da sala.',
      authorName: 'Carlos Mendes',
      serviceType: 'Pintura Interna',
    },
    {
      id: 3,
      text: 'A estrutura metálica do meu galpão ficou perfeita. Recomendo de olhos fechados a equipe da SOS Construir.',
      authorName: 'Fernanda Lima',
      serviceType: 'Estrutura Metálica',
    },
    {
      id: 4,
      text: 'Finalmente um serviço sem dor de cabeça. O aplicativo me ajudou a achar o encanador perfeito no domingo.',
      authorName: 'Roberto Souza',
      serviceType: 'Encanador',
    },
    {
      id: 5,
      text: 'Garantia cumprida à risca. Tive um pequeno problema após a instalação e eles resolveram no dia seguinte.',
      authorName: 'Aline Ferreira',
      serviceType: 'Instalação Elétrica',
    },
  ]

  loading.value = false
}

onMounted(() => {
  fetchTestimonials()
})
</script>

<template>
  <section class="py-16 md:py-10 w-full overflow-hidden" :class="section.bgSection">
    <div class="container mx-auto px-4 mb-12 text-center">
      <span class="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3">
        {{ section.kicker }}
      </span>
      <h2 class="title-section">
        {{ section.title }}
      </h2>
    </div>

    <div v-if="loading" class="flex gap-6 px-4">
      <div v-for="i in 5" :key="i"
        class="w-[300px] md:w-[400px] shrink-0 bg-white border border-gray-100 rounded-2xl p-8 h-64 animate-pulse flex flex-col">
        <div class="space-y-3 mb-8">
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
        </div>
        <div class="mt-auto flex flex-col items-center gap-2">
          <USkeleton class="h-4 w-1/3" />
          <USkeleton class="h-4 w-1/4" />
        </div>
      </div>
    </div>

    <div v-else class="relative w-full group">
      <div>
        <UCarousel v-slot="{ item }" loop :auto-scroll="{
          speed: 1,
          stopOnMouseEnter: false,
          stopOnInteraction: false,
        }" :items="testimonials" :ui="{
          item: 'basis-2/3 sm:basis-2/4 md:basis-2/4 lg:basis-2/4 xl:basis-1/4',
        }">
          <TestimonialCard :testimonial="item" class="my-1" />
        </UCarousel>
      </div>
    </div>
  </section>
</template>
