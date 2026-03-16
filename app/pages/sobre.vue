<script setup lang="ts">
import type { FinalCtaSection } from '~/types/sections'
import type { ServiceHeroSection } from '~/types/servicePage'

// SEO e Meta Tags
useSeoMeta({
  title: 'Sobre Nós | SOS Construir - Foz do Iguaçu',
  description: 'Conheça a Só Construir, o seu SOS da Construção em Foz do Iguaçu. Transformamos sonhos em realidade com qualidade, prazos cumpridos e zero dor de cabeça.',
  ogTitle: 'Sobre a SOS Construir',
  ogDescription: 'Sua parceira de confiança para construção e reforma em Foz do Iguaçu.',
})

const hero: ServiceHeroSection = {
  title: 'Sua obra do jeito certo. Sem Dor de Cabeça.',
  description: 'Conectamos você aos melhores profissionais e materiais da região, e cuidamos de cada etapa da obra. ',
  image: '/images/about/hero.jpg',
  secondaryCta: {
    text: 'Conheça Nossos Serviços',
    link: '/servicos',
    icon: 'mdi:arrow-right',
  },
  features: [
    {
      text: '10+ anos de experiência',
      icon: 'mdi:hammer'
    },
    {
      text: 'Mais de 1000 clientes satisfeitos',
      icon: 'mdi:emoticon'
    },
    {
      text: 'Garantia total em cada projeto',
      icon: 'mdi:house'
    }
  ],
}
const finalCta: FinalCtaSection = {
  title: 'Pronto para tirar o seu projeto do papel?',
  description: 'Fale com a SOS Construir e descubra como podemos planejar, organizar e executar sua obra com mais confiança, clareza e qualidade em cada etapa.',
  ctaText: 'Fale com um Especialista',
}

</script>

<template>
  <div class="min-h-screen bg-white">
    <SectionServiceHero :section="hero" />
    <SectionAboutOurHistory />
    <SectionAboutOurMission />
    <SectionOurProcess />
    <SectionAboutFeatures />
    <SectionFinalCta :section="finalCta" />
  </div>
</template>