<script setup lang="ts">
import type { FinalCtaSection } from '~/types/sections'

const defaultSection: FinalCtaSection = {
  title: 'Se ficar com alguma dúvida',
  description: 'Entre em contato com nossa equipe',
  buttonText: 'Fale com a SOS (WhatsApp)',
  buttonIcon: 'mdi:chat-outline',
  buttonLink: 'https://wa.me/554599976544?text=Ol%C3%A1%21%20Vim%20pelo%20site%20sosconstuir.com.br%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es'
}
const props = defineProps<{
  section?: Partial<FinalCtaSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section
}))
</script>

<template>
  <section class="bg-blue-500 py-5 md:py-13 w-full text-center">
    <div class="container mx-auto px-4 flex flex-col items-center">
      <h2 class="title-section text-3xl md:text-4xl font-bold text-white ">
        {{ section.title }}
      </h2>
      <p class="text-white/80 text-base md:text-lg mb-8">
        {{ section.description }}
      </p>
      <UButton
        :to="section.buttonLink"
        target="_blank"
        color="primary"
        variant="solid"
        size="xl"
        class="text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
      >
        <template #leading>
          <Icon
            :name="section.buttonIcon || 'mdi:chat-outline' "
            class="text-2xl"
          />
        </template>
        {{ section.buttonText }}
      </UButton>
    </div>
  </section>
</template>
