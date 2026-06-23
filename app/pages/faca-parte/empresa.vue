<script setup lang="ts">
// Página-ponte: encaminha o cadastro de empresa para o formulário atual
// (Google Form). Utilitária → fora do índice (§12 da spec).
useSeoMeta({ robots: 'noindex, follow' })

await navigateTo(FORM_EMPRESA_LINK, { external: true })
</script>

<template>
  <div />
</template>
