<script setup lang="ts">
import type { ProcessSection } from '@/types/sections'

const defaultSection: ProcessSection = {
  title: 'Como funciona nosso processo',
  description:
    'Do primeiro contato até a entrega, nós gerenciamos cada detalhe para que você não precise se preocupar com nada.',
  steps: [
    {
      step: 1,
      title: 'Contato e Orçamento',
      description:
        'Descreva o que você precisa. Nossa plataforma conecta o seu projeto aos melhores profissionais da região.',
      icon: 'phone-in-talk-outline',
    },
    {
      step: 2,
      title: 'Escolha com Segurança',
      description:
        'Receba orçamentos e compare perfis. Todos os nossos profissionais são rigorosamente verificados e avaliados.',
      icon: 'shield-alert',
    },
    {
      step: 3,
      title: 'Execução Premium',
      description:
        'O profissional escolhido realiza o trabalho com qualidade, cumprindo os prazos e requisitos combinados.',
      icon: 'hammer-screwdriver',
    },
    {
      step: 4,
      title: 'Entrega e Garantia',
      description:
        'Obra limpa e finalizada! Você aprova o serviço e conta com a nossa garantia integral para sua tranquilidade.',
      icon: 'handshake',
    },
  ],
}

const props = defineProps<{
  section?: Partial<ProcessSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))
</script>

<template>
  <section class="py-16 md:py-10" :class="section.bgSection">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="text-center mb-16 md:mb-20">
        <span class="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3">
          DO INÍCIO AO FIM
        </span>
        <h2 class="title-section">
          {{ section.title }}
        </h2>
        <p class="text-section-subtitle text-base md:text-lg max-w-2xl mx-auto">
          {{ section.description }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative">
        <div
          v-for="(step, index) in section.steps"
          :key="step.step"
          class="relative flex flex-col items-center text-center"
        >
          <template v-if="index < section.steps.length - 1">
            <div
              class="hidden md:block absolute top-[40px] left-1/2 w-full h-[2px] bg-gray-200 z-0"
            />
            <div
              class="md:hidden absolute top-[40px] left-1/2 w-[2px] h-[calc(100%+3rem)] bg-gray-200 z-0 -translate-x-1/2"
            />
          </template>

          <div
            class="w-20 h-20 rounded-full bg-[#F1F5F9] flex items-center justify-center relative z-10 mb-6 shadow-sm border border-white"
          >
            <div
              class="absolute -top-1.5 -right-1.5 bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md border-2 border-white"
            >
              {{ step.step }}
            </div>
            <Icon :name="'mdi:' + step.icon" class="text-3xl text-blue-500" />
          </div>

          <div class="relative z-10 py-2 px-2 w-full" :class="section.bgSection || 'bg-white'">
            <h3 class="text-lg font-bold text-blue-500 mb-3">
              {{ step.title }}
            </h3>
            <p class="text-sm text-section-subtitle leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
