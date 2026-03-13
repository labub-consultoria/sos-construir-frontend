// TODO: ESTILIZAR CORRETAMENTE OS LINKS https://ui.nuxt.com/docs/components/navigation-menu
// AUMENTAR
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

// Definição dos links de navegação solicitados
const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Serviços',
    to: '/servicos',
    active: route.path.startsWith('/servicos')
  },
  {
    label: 'Profissionais',
    to: '/profissionais',
    active: route.path.startsWith('/profissionais')
  },
  {
    label: 'Portfólio',
    to: '/portfolio',
    active: route.path.startsWith('/portfolio')
  },
  {
    label: 'Catalogo',
    to: '/catalogo',
    active: route.path.startsWith('/catalogo')
  },
  {
    label: 'Blog',
    to: '/blog',
    active: route.path.startsWith('/blog')
  }
])

defineProps<{
  ctaLink: string
  ctaText: string
}>()

</script>

<template>
  <UHeader>
    <template #title>
      <div class="flex items-center gap-2 font-bold text-2xl text-blue-950 max-w-40">
        <AppLogo />
      </div>
    </template>

    <UNavigationMenu color="primary" class="text-whites" :items="items" :ui="{
      linkLabel: 'text-blue-500 hover:text-blue-600 text-base',
    }" />

    <template #right>
      <UButton color="primary" size="md" :to="ctaLink"
        class="font-semibold shadow-sm hover:shadow-md transition-all hidden lg:flex py-3 px-6">
        {{ ctaText }}
      </UButton>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" :ui="{
        link: 'block text-center',
        linkLabel: 'text-blue-500 hover:text-blue-600 text-base ',
      }" />

      <UButton color="primary" size="lg" block class="mt-6 font-semibold" :to="ctaLink">
        {{ ctaText }}
      </UButton>
    </template>
  </UHeader>
</template>