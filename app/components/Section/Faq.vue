<script setup lang="ts">
import { ref } from 'vue'
import type { FAQSection } from '~/types/sections'

defineProps<{
  section: FAQSection
}>()

// Controla qual aba está aberta. Inicia com 0 para o primeiro item já vir aberto.
const openIndex = ref<number | null>(0)

// Alterna entre abrir e fechar a aba clicada
const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="py-16 w-full" :class="section?.bgSection">
    <div class="container mx-auto px-4 max-w-3xl">
      <h2 class="title-section text-center mb-10">
        {{ section.title }}
      </h2>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in section.questions"
          :key="index"
          class="border border-gray-200 rounded-xl bg-section-bg-2 overflow-hidden transition-all duration-200"
          :class="{ 'shadow-sm border-gray-300': openIndex === index }"
        >
          <button
            class="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            @click="toggle(index)"
          >
            <span class="font-bold text-blue-700 text-base pr-4">
              {{ faq.question }}
            </span>
            <Icon
              name="mdi:chevron-down"
              class="text-2xl text-section-subtitle flex-shrink-0 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === index }"
            />
          </button>

          <div
            v-show="openIndex === index"
            class="px-6 pb-6 text-section-subtitle text-md leading-relaxed"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
