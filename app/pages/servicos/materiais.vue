<script setup lang="ts">
const meta: Meta = {
  title: 'Materiais de Construção em Foz do Iguaçu',
  description:
    'Materiais de construção com preço justo e qualidade garantida para a sua obra. A SOS Construir conecta você aos melhores fornecedores de Foz do Iguaçu.',
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
  <ServiceHub type="material" />
</template>
