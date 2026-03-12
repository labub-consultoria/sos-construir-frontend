<script setup lang="ts">
import type Testimonial from '~/types/testimonial'

defineProps<{
  testimonial: Testimonial
}>()
</script>

<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
  >
    <Icon name="mdi:format-quote-open" class="text-orange-500 text-3xl mb-4" />

    <p class="text-section-subtitle text-sm leading-relaxed mb-8 flex-grow">
      {{ testimonial.text }}
    </p>

    <div class="text-center mt-auto">
      <p class="font-bold text-blue-500 text-base">
        {{ testimonial.authorName }}
      </p>
      <p class="text-xs text-section-subtitle mt-0.5">
        {{ testimonial.serviceType }}
      </p>
    </div>
  </div>
</template>
