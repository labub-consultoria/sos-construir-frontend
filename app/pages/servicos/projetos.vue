<script setup lang="ts">
const meta: Meta = {
  title: 'Projetos de Engenharia e Arquitetura em Foz do Iguaçu',
  description:
    'Projeto elétrico, hidráulico, estrutural e arquitetônico para a sua obra. A SOS Construir conecta você aos melhores projetistas de Foz do Iguaçu.',
}

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
  twitterTitle: meta.title,
  twitterDescription: meta.description,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <ServiceHub type="projeto" />
</template>
