<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core';

useSchemaOrg([
  defineLocalBusiness({
    '@type': 'HomeAndConstructionBusiness',
    '@id': 'https://www.sosconstruir.com.br/#identity',
    name: 'SOS Construir',
    description:
      'Empresa especializada em construção, reforma e acabamento em Foz do Iguaçu.',
    url: 'https://www.sosconstruir.com.br',
    logo: 'https://www.sosconstruir.com.br/logo.svg',
    image: 'https://www.sosconstruir.com.br/og-image.jpg',
    telephone: '+5545999976544',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'R. dos Eucaliptos, 597',
      addressLocality: 'Foz do Iguaçu',
      addressRegion: 'PR',
      postalCode: '85854-610',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-25.5163',
      longitude: '-54.5854',
    },
    areaServed: [
      { '@type': 'City', name: 'Foz do Iguaçu' },
      { '@type': 'City', name: 'Santa Terezinha de Itaipu' },
    ],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '12:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/sos_construir',
      'https://www.facebook.com/sosconstruir',
    ],
  })
])

useHead({
  htmlAttrs: {
    lang: 'pt-BR',
  },
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
})

// 2. Metadados para SEO e Redes Sociais
const meta: Meta = {
  title: 'Construção e Reforma em Foz do Iguaçu',
  description:
    'Mais de 10 anos resolvendo obras e reformas em Foz do Iguaçu. Eletricista, encanador, pedreiro, energia solar e mais de 20 serviços com garantia, materiais de qualidade e zero dor de cabeça.',
  ogImage: '/og-image.jpg',
  breadcrumbLabel: 'Início',
}

useSeoMeta({
  title: meta.title,
  description: meta.description,
  robots: 'index, follow',

  // Open Graph
  ogType: 'website',
  ogLocale: 'pt_BR',
  ogSiteName: 'SOS Construir',
  ogTitle: meta.title,
  ogDescription: meta.description,
  ogImage: meta.ogImage,
  ogImageAlt: 'SOS Construir - Construção e Reforma em Foz do Iguaçu',

  // Twitter / X
  twitterSite: '@sosconstruir',
  twitterTitle: meta.title,
  twitterDescription: meta.description,
  twitterImage: meta.ogImage,
  twitterCard: 'summary_large_image',
})

// Botao flutuante
const { y } = useWindowScroll()
const showBackToTop = computed(() => y.value > 400)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <UApp class="app">
    <AppHeader :cta-link="DEFAULT_CTA_WHATSAPP_LINK" cta-text="Solicitar Orçamento" />
    <UMain>
      <NuxtPage />
    </UMain>
    <AppFooter :email="EMAIL" :phone-number="PHONENUMBER" :whatsapp-link="DEFAULT_CTA_WHATSAPP_LINK" />
    <Transition name="fade">
      <div v-if="showBackToTop" class="fixed bottom-8 right-8">
        <UButton class="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg"
          aria-label="Voltar ao topo" @click="scrollToTop" icon="mdi:arrow-up" />
      </div>
    </Transition>
  </UApp>
</template>

<style>
/* Transição do botão flutuante */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>