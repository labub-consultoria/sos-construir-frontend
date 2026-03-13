<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import type Meta from './types/meta';
import formatWhatsappLink from './utils/formatWhatsappLink';

const PHONENUMBER = '5545999976544'
const EMAIL = 'contato@sosconstruir.com.br'
const whatsappMessage = encodeURIComponent('Olá! Gostaria de solicitar um orçamento para minha obra.')
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://sosconstruir.com.br' },
  ],
  htmlAttrs: {
    lang: 'pt-BR',
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'SOS Construir',
        description:
          'Mais de 10 anos resolvendo obras e reformas em Foz do Iguaçu. Eletricista, encanador, pedreiro, energia solar e mais de 20 serviços com garantia e zero dor de cabeça.',
        url: 'https://sosconstruir.com.br',
        telephone: PHONENUMBER,
        image: 'https://sosconstruir.com.br/og-image.jpg',
        logo: 'https://sosconstruir.com.br/logo.png',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'R. dos Eucalíptos, 597',
          addressLocality: 'Foz do Iguaçu',
          addressRegion: 'PR',
          postalCode: '85854-610',
          addressCountry: 'BR',
          addressArea: 'Jardim Bourbon',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -25.5163,
          longitude: -54.5854,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '07:00',
            closes: '17:30',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Friday',
            opens: '07:00',
            closes: '16:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '07:00',
            closes: '12:00',
          },
        ],
        areaServed: {
          '@type': 'City',
          name: 'Foz do Iguaçu',
        },
        sameAs: [
          'https://www.instagram.com/sos_construir',
          'https://www.facebook.com/sosconstruir',
        ],
      }),
    },
  ],
})

const meta: Meta = {
  title: 'SOS Construir | Construção e Reforma em Foz do Iguaçu',
  description:
    'Mais de 10 anos resolvendo obras e reformas em Foz do Iguaçu. Eletricista, encanador, pedreiro, energia solar e mais de 20 serviços com garantia, materiais de qualidade e zero dor de cabeça.',
  keywords:
    'construção Foz do Iguaçu, reforma Foz do Iguaçu, empresa de reforma, empresa de construção, eletricista, encanador, pedreiro, pintor, energia solar, serviços residenciais, mão de obra, orçamento de obra, reforma com garantia, SOS Construir',
  ogImage: '/og-image.jpg',
  breadcrumbLabel: 'Início',
}

useSeoMeta({
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  robots: 'index, follow',

  // Open Graph
  ogType: 'website',
  ogLocale: 'pt_BR',
  ogSiteName: 'SOS Construir',
  ogTitle: meta.title,
  ogDescription: meta.description,
  ogImage: meta.ogImage,
  ogImageAlt: 'SOS Construir - Construção e Reforma em Foz do Iguaçu',
  ogUrl: 'https://sosconstruir.com.br',

  // Twitter / X
  twitterSite: '@sosconstruir',
  twitterTitle: meta.title,
  twitterDescription: meta.description,
  twitterImage: meta.ogImage,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp>
    <AppHeader :cta-link="formatWhatsappLink(PHONENUMBER, whatsappMessage)" cta-text="Solicitar Orçamento" />
    <UMain>
      <NuxtPage />
    </UMain>
    <AppFooter :email="EMAIL" :phone-number="PHONENUMBER"
      :whatsapp-link="formatWhatsappLink(PHONENUMBER, whatsappMessage)" />
  </UApp>
</template>
