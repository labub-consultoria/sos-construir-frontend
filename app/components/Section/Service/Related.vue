<script setup lang="ts">
import type { RelatedServicesSection } from '~~/shared/types/servicePage'
import type { ServiceCard } from '~~/shared/types/sections'

const defaultSection: Partial<RelatedServicesSection> = {
  title: 'Sua obra também vai precisar de',
  description: 'Serviços que costumam andar juntos. Você resolve tudo com a SOS, em um contato só.',
}

const props = defineProps<{
  section?: Partial<RelatedServicesSection>
}>()

const section = computed(() => ({ ...defaultSection, ...props.section }))

// `type` significa coisas diferentes nos dois: no serviço é o trilho (execucao/locacao); no card,
// a variante visual.
const cards = computed<ServiceCard[]>(() =>
  (props.section?.items ?? []).map(({ type: _trilho, ...service }): ServiceCard => ({
    ...service,
    link: `/servicos/${service.slug}`,
    size: 'medium',
    type: 'standard',
  }))
)
</script>

<template>
  <section v-if="cards.length" class="py-16 w-full" :class="props.section?.bgSection">
    <div class="container mx-auto px-4 max-w-7xl">
      <h2 class="title-section">
        {{ section.title }}
      </h2>
      <p class="subtitle-section mb-8 leading-relaxed">
        {{ section.description }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard v-for="card in cards" :key="card.id" :card="card" />
      </div>
    </div>
  </section>
</template>
