<script setup lang='ts'>
import type { ProcessSection, WorkGallerySection } from '@/types/sections'

const process: ProcessSection = {
  steps: [
    {
      step: 1,
      title: 'Contato e Orçamento',
      description:
        'Descreva o que você precisa. Nossa plataforma conecta o seu projeto aos melhores profissionais da região.',
      icon: 'phone-in-talk-outline'
    },
    {
      step: 2,
      title: 'Escolha com Segurança',
      description:
        'Receba orçamentos e compare perfis. Todos os nossos profissionais são rigorosamente verificados e avaliados.',
      icon: 'shield-alert'
    },
    {
      step: 3,
      title: 'Execução Premium',
      description:
        'O profissional escolhido realiza o trabalho com qualidade, cumprindo os prazos e requisitos combinados.',
      icon: 'hammer-screwdriver'
    },
    {
      step: 4,
      title: 'Entrega e Garantia',
      description:
        'Obra limpa e finalizada! Você aprova o serviço e conta com a nossa garantia integral para sua tranquilidade.',
      icon: 'handshake'
    }
  ]
}
const worksGallery: WorkGallerySection = {
  filters: [
    {
      label: 'Todos os Projetos',
      slug: 'todos',
      count: 600
    },
    {
      label: 'Construções',
      slug: 'construcoes',
      count: 100
    },
    {
      label: 'Reformas',
      slug: 'reformas',
      count: 200
    },
    {
      label: 'Piscinas',
      slug: 'piscinas',
      count: 70
    }
  ]
}
</script>

<template>
  <div>
    <section-hero />
    <section-validation />
    <section-services-categories />
    <section-partners />
    <section-why-choose-us />
    <section-our-process
      :section="{
        ...process,
        bgSection: 'bg-section-bg-1'
      }"
    />
    <section-professionals
      :section="{
        title: 'Nossos Profissionais Especializados',
        description: 'Escolha entre mais de 100 profissionais certificados.',
        bgSection: 'bg-section-bg-2'
      }"
    />
    <section-works-gallery
      :section="{
        ...worksGallery,
        bgSection: 'bg-section-bg-1'
      }"
    />
    <section-testimonials
      :section="{
        title: 'Clientes que confiam na SOS',
        bgSection: 'bg-section-bg-2'
      }"
    />
    <section-blog
      :section="{
        title: 'Dicas e Novidades de Construção',
        bgSection: 'bg-section-bg-1'
      }"
    />
    <section-final-cta />
  </div>
</template>
