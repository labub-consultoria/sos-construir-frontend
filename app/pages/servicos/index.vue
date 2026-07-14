<script setup lang="ts">
const meta: Meta = {
  title: 'Serviços de Construção e Reforma em Foz do Iguaçu',
  description:
    'Eletricista, encanador, pintor, pedreiro, energia solar e muito mais. A SOS Construir conecta você aos melhores especialistas de Foz do Iguaçu com garantia, sem dor de cabeça. Peça seu orçamento.',
}

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
  twitterTitle: meta.title,
  twitterDescription: meta.description,
  twitterImage: meta.ogImage,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <ServiceHub type="execucao" />
</template>
