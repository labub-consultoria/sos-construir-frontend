<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { FinalCtaSection } from '~~/shared/types/sections'

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Faça parte' },
]

useBreadcrumbSchema(breadcrumbItems)

useSeoMeta({
  title: 'Trabalhe conosco na SOS Construir — faça parte da nossa rede',
  description:
    'Seja um parceiro ou prestador de serviço da SOS Construir em Foz do Iguaçu. Forneça materiais, patrocine páginas de serviço ou entre na nossa rede de profissionais e receba obras para executar.',
  ogTitle: 'Faça parte da SOS Construir',
  ogDescription:
    'Empresas, fornecedores e profissionais: escolha como você quer fazer parte da SOS Construir.',
})

const stats = [
  { icon: 'mdi:calendar-blank-outline', text: '+10 anos de experiência' },
  { icon: 'mdi:account-group-outline', text: '+100 parceiros na rede' },
  { icon: 'mdi:office-building-outline', text: '+1000 obras realizadas' },
]

interface JoinPath {
  icon: string
  overline: string
  title: string
  description: string
  bullets: string[]
  ctaText: string
  ctaLink: string
}

const paths: JoinPath[] = [
  {
    icon: 'mdi:office-building-outline',
    overline: 'Para fornecedores e parceiros',
    title: 'Cadastro de empresa',
    description:
      'Forneça materiais, patrocine páginas de serviço e ganhe visibilidade com milhares de clientes em obras na região.',
    bullets: [
      'Fornecimento de materiais',
      'Patrocínio de páginas de serviço',
      'Visibilidade da sua marca',
    ],
    ctaText: 'Quero ser parceiro',
    ctaLink: FORM_EMPRESA_LINK,
  },
  {
    icon: 'mdi:hard-hat',
    overline: 'Para profissionais',
    title: 'Cadastro de prestador de serviço',
    description:
      'É pintor, eletricista, encanador ou de outra área da construção? Entre para a nossa rede de profissionais e atenda clientes que já confiam na gente.',
    bullets: [
      'Receba obras para executar',
      'Faça parte da rede de +100 parceiros',
      '+10 anos de marca consolidada',
    ],
    ctaText: 'Quero me cadastrar',
    ctaLink: FORM_PRESTADOR_LINK,
  },
]

const finalCta: FinalCtaSection = {
  title: 'Ficou com alguma dúvida?',
  description:
    'Fale com a nossa equipe antes de se cadastrar. A gente te ajuda a escolher o melhor caminho.',
  ctaText: 'Fale com a SOS (WhatsApp)',
  ctaIcon: 'mdi:chat-outline',
  ctaLink: formatWhatsappLink(
    PHONENUMBER,
    encodeURIComponent('Olá! Tenho uma dúvida sobre fazer parte da SOS Construir.')
  ),
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="w-full bg-white">
      <div class="container max-w-7xl mx-auto px-4 pt-8">
        <div class="text-sm text-gray-500 mb-6 flex gap-2 items-center">
          <UBreadcrumb :items="breadcrumbItems" />
        </div>
      </div>
      <div class="container max-w-7xl mx-auto px-4 pb-12 md:pb-20 flex flex-col items-center text-center">
        <h1 class="text-blue-500 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
          Faça parte da SOS Construir
        </h1>
        <p class="text-slate-600 text-lg mt-6 max-w-2xl leading-relaxed">
          Somos referência em construção e reforma em Foz do Iguaçu.<br class="hidden sm:block">
          Conectamos clientes a uma rede de profissionais e fornecedores
          parceiros. Escolha como você quer fazer parte.
        </p>
        <div
          class="flex flex-wrap justify-center items-center gap-y-2 text-sm font-medium text-section-subtitle mt-8">
          <template v-for="(stat, index) in stats" :key="stat.text">
            <div class="flex items-center gap-1.5 px-4">
              <Icon :name="stat.icon" class="text-orange-500 text-lg" />
              <span>{{ stat.text }}</span>
            </div>
            <span v-if="index < stats.length - 1" class="text-gray-300 hidden sm:block">|</span>
          </template>
        </div>
      </div>
    </section>

    <!-- Caminhos -->
    <section class="w-full pb-16">
      <div class="container max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div v-for="path in paths" :key="path.title"
          class="flex flex-col h-full min-h-[32rem] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 md:p-8">
          <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
            <Icon :name="path.icon" class="text-orange-500 text-2xl" />
          </div>
          <span class="text-sm font-bold text-orange-500 mb-2">{{ path.overline }}</span>
          <h2 class="text-2xl font-bold text-blue-500 mb-4">{{ path.title }}</h2>
          <p class="text-slate-600 leading-relaxed mb-6">{{ path.description }}</p>
          <ul class="flex flex-col gap-3 mb-8">
            <li v-for="bullet in path.bullets" :key="bullet"
              class="flex items-start gap-3 text-blue-500 font-medium">
              <Icon name="mdi:check-circle-outline" class="text-orange-500 text-xl shrink-0 mt-0.5" />
              <span class="leading-relaxed text-sm">{{ bullet }}</span>
            </li>
          </ul>
          <UButton :to="path.ctaLink" target="_blank" rel="noopener" color="primary" variant="solid"
            size="xl" trailing-icon="mdi:open-in-new" :ui="{ trailingIcon: 'w-5 h-5' }"
            class="w-full justify-center py-3 mt-auto font-semibold rounded-lg" :aria-label="path.ctaText + ' (abre em nova aba)'">
            {{ path.ctaText }}
          </UButton>
        </div>
      </div>
    </section>

    <SectionFinalCta :section="finalCta" />
  </div>
</template>
