<script setup lang="ts">
import type { ProcessSection, ServiceCard, WorkGallerySection } from '@/types/sections'
import type Meta from '~/types/meta'
import servicesData from '~/data/services.json'
import type { Service } from '~/types/service'

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

  ogTitle: meta.title,
  ogDescription: meta.description,
  ogImage: meta.ogImage,

  twitterTitle: meta.title,
  twitterDescription: meta.description,
  twitterImage: meta.ogImage,
  twitterCard: 'summary_large_image',
})
const services = servicesData.services as Service[]
const topServices: ServiceCard[] = services
  .toSorted((a, b) => b.popularity - a.popularity)
  .slice(0, 5)
  .map((s: Service, i): ServiceCard => {
    return {
      ...s,
      link: `/servicos/${s.slug}`,
      size: i === 0 ? 'large' : 'medium',
      type: i % 1 === 0 ? 'image' : 'standard'
    }
  })


const process: ProcessSection = {
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
const worksGallery: WorkGallerySection = {
  filters: [
    {
      label: 'Todos os Projetos',
      slug: 'todos',
      count: 600,
    },
    {
      label: 'Construções',
      slug: 'construcoes',
      count: 100,
    },
    {
      label: 'Reformas',
      slug: 'reformas',
      count: 200,
    },
    {
      label: 'Piscinas',
      slug: 'piscinas',
      count: 70,
    },
  ],
}
</script>

<template>
  <div>
    <section-hero :section="{ bgSection: 'bg-section-bg-1' }" />
    <section-validation :section="{ bgSection: 'bg-section-bg-2' }" />
    <section-services-categories :section="{
      bgSection: 'bg-section-bg-1',
      services: topServices
    }" />
    <section-partners :section="{ bgSection: 'bg-section-bg-2' }" />
    <section-why-choose-us :section="{ bgSection: 'bg-section-bg-1' }" />
    <section-professionals :section="{
      title: 'Nossos Profissionais Especializados',
      description: 'Escolha entre mais de 100 profissionais certificados.',
      bgSection: 'bg-section-bg-2',
    }" />
    <section-our-process :section="{ ...process, bgSection: 'bg-section-bg-1' }" />

    <section-works-gallery :section="{
      ...worksGallery,
      bgSection: 'bg-section-bg-2',
    }" />
    <section-testimonials :section="{
      title: 'Clientes que confiam na SOS',
      bgSection: 'bg-section-bg-1',
    }" />
    <section-blog :section="{
      title: 'Dicas e Novidades de Construção',
      bgSection: 'bg-section-bg-2',
    }" />
    <section-final-cta :section="{
      title: 'Pronto Para Começar Seu Projeto?',
      description:
        'Solicite um orçamento gratuito e sem compromisso. Nossa equipe entrará em contato em até 24 horas.',
    }" />
  </div>
</template>
