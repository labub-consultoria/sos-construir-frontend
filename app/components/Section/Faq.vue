<script setup lang="ts">
import { ref } from 'vue'
import type { FAQSection } from '~~/shared/types/sections'

const props = defineProps<{
  section: FAQSection
}>()

const openIndex = ref<number | null>(0)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

// FAQ como nó FAQPage próprio (@id #faq), desacoplado da WebPage da rota.
// Evita sobrescrever name/@type/mainEntity da página (que é ItemPage + Service).
// FAQPage não gera rich result para site comercial; mantido pelo valor de citação por IA/LLM.
const route = useRoute()
const siteConfig = useSiteConfig()

useSchemaOrg([
  {
    '@type': 'FAQPage',
    '@id': `${siteConfig.url}${route.path}#faq`,
    inLanguage: 'pt-BR',
    name: props.section.title,
    mainEntity: props.section.questions.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
])
</script>

<template>
  <section class="py-16 w-full" :class="section?.bgSection">
    <div class="container mx-auto px-4 max-w-3xl">
      <h2 class="title-section text-center mb-10">
        {{ section.title }}
      </h2>

      <div class="space-y-4">
        <div v-for="(faq, index) in section.questions" :key="index"
          class="border border-gray-200 rounded-xl bg-section-bg-2 overflow-hidden transition-all duration-200"
          :class="{ 'shadow-sm border-gray-300': openIndex === index }">
          <button class="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            @click="toggle(index)">
            <span class="font-bold text-blue-700 text-base pr-4">
              {{ faq.question }}
            </span>
            <Icon name="mdi:chevron-down"
              class="text-2xl text-section-subtitle flex-shrink-0 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === index }" />
          </button>

          <div v-show="openIndex === index" class="px-6 pb-6 text-section-subtitle text-md leading-relaxed">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
