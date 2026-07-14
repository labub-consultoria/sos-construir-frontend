<script setup lang="ts">
const meta: Meta = {
  title: 'Locação de Equipamentos para Obra em Foz do Iguaçu',
  description:
    'Caçamba de entulho, andaimes, banheiro químico, empilhadeira e equipamentos pesados. A SOS Construir conecta você às melhores locadoras de Foz do Iguaçu. Peça seu orçamento.',
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
  <ServiceHub type="locacao" />
</template>
