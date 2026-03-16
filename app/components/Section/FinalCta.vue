<script setup lang="ts">
import type { FinalCtaSection } from '~/types/sections'

const defaultSection: FinalCtaSection = {
  title: 'Se ficar com alguma dúvida',
  description: 'Entre em contato com nossa equipe',
  ctaText: 'Fale com a SOS (WhatsApp)',
  ctaIcon: 'mdi:chat-outline',
  ctaLink: DEFAULT_CTA_WHATSAPP_LINK
}
const props = defineProps<{
  section?: Partial<FinalCtaSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))
</script>

<template>
  <section class="bg-blue-500 py-5 md:py-13 w-full text-center">
    <div class="container mx-auto px-4 flex flex-col items-center">
      <h2 class="title-section text-3xl md:text-4xl font-bold text-white">
        {{ section.title }}
      </h2>
      <p class="text-white/80 text-base md:text-lg mb-8 lg:max-w-3xl">
        {{ section.description }}
      </p>
      <UButton :to="section.ctaLink" target="_blank" color="primary" variant="solid" size="xl"
        class="text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2">
        <template #leading>
          <Icon :name="section.ctaIcon || 'mdi:chat-outline'" class="text-2xl" />
        </template>
        {{ section.ctaText }}
      </UButton>
    </div>
  </section>
</template>
