<script setup lang='ts'>
import type { ProcessSection } from '@/types/sections'

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
</script>

<template>
  <div>
    <section-hero />
    <section-validation />
    <section-services-categories />
    <section-why-choose-us />
    <section-our-process
      :section="process"
    />
    <section-works-gallery />
    <section-clients-feedback />
    <section-blog-posts />
    <section-final-cta />
  </div>
</template>
