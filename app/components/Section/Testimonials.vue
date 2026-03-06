<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type Testimonial from '~/types/testimonial'
import type { BaseSection } from '~/types/sections'

defineProps<{
  section?: BaseSection
}>()

const testimonials = ref<Testimonial[]>([])
const loading = ref(true)

const fetchTestimonials = async () => {
  loading.value = true

  // Simulando delay de rede de 1 segundo
  await new Promise(resolve => setTimeout(resolve, 1000))

  testimonials.value = [
    {
      id: 1,
      text: 'Atendimento, Profissionalismo, Qualidade, Valor acessível! Reformaram minha cozinha inteira.',
      authorName: 'Patricia Wionczak',
      serviceType: 'Reforma Cozinha'
    },
    {
      id: 2,
      text: 'Trabalho impecável e entregue antes do prazo. O pintor foi super cuidadoso com os móveis da sala.',
      authorName: 'Carlos Mendes',
      serviceType: 'Pintura Interna'
    },
    {
      id: 3,
      text: 'A estrutura metálica do meu galpão ficou perfeita. Recomendo de olhos fechados a equipe da SOS Construir.',
      authorName: 'Fernanda Lima',
      serviceType: 'Estrutura Metálica'
    },
    {
      id: 4,
      text: 'Finalmente um serviço sem dor de cabeça. O aplicativo me ajudou a achar o encanador perfeito no domingo.',
      authorName: 'Roberto Souza',
      serviceType: 'Encanador'
    },
    {
      id: 5,
      text: 'Garantia cumprida à risca. Tive um pequeno problema após a instalação e eles resolveram no dia seguinte.',
      authorName: 'Aline Ferreira',
      serviceType: 'Instalação Elétrica'
    }
  ]

  loading.value = false
}

onMounted(() => {
  fetchTestimonials()
})
</script>

<template>
  <section class="py-16 md:py-24 bg-section-bg-2 w-full overflow-hidden">
    <div class="container mx-auto px-4 mb-12">
      <h2 class="title-section text-center">
        {{ section?.title || 'O Que Dizem Nossos Clientes' }}
      </h2>
    </div>

    <div
      v-if="loading"
      class="flex gap-6 px-4"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="w-[300px] md:w-[400px] shrink-0 bg-white border border-gray-100 rounded-2xl p-8 h-64 animate-pulse flex flex-col"
      >
        <div class="w-8 h-8 bg-gray-200 rounded mb-4" />
        <div class="space-y-3 mb-8">
          <div class="h-4 bg-gray-200 rounded w-full" />
          <div class="h-4 bg-gray-200 rounded w-5/6" />
          <div class="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        <div class="mt-auto flex flex-col items-center gap-2">
          <div class="h-4 bg-gray-200 rounded w-1/2" />
          <div class="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>

    <div
      v-else
      class="relative w-full group"
    >
      <div class="marquee-track flex">
        <div class="flex gap-6 pr-6">
          <TestimonialCard
            v-for="testimonial in testimonials"
            :key="'first-' + testimonial.id"
            :testimonial="testimonial"
            class="w-[300px] md:w-[400px] shrink-0"
          />
        </div>

        <div class="flex gap-6 pr-6">
          <TestimonialCard
            v-for="testimonial in testimonials"
            :key="'second-' + testimonial.id"
            :testimonial="testimonial"
            class="w-[300px] md:w-[400px] shrink-0"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  width: max-content;
  animation: scroll-left 40s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
