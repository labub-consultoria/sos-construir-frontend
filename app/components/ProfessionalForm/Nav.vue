<script setup lang="ts">
withDefaults(
  defineProps<{
    showBack?: boolean
    nextLabel?: string
    nextIcon?: string
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    showBack: true,
    nextLabel: 'Avançar',
    nextIcon: 'mdi:arrow-right',
    loading: false,
    disabled: false
  }
)

const emit = defineEmits<{ prev: [] }>()
</script>

<template>
  <div class="flex items-center gap-3 pt-2" :class="showBack ? 'justify-between' : 'justify-end'">
    <UButton
      v-if="showBack"
      type="button"
      color="neutral"
      variant="ghost"
      size="lg"
      icon="mdi:arrow-left"
      class="font-semibold"
      @click="emit('prev')"
    >
      Voltar
    </UButton>
    <UButton
      type="submit"
      color="primary"
      variant="solid"
      size="xl"
      :trailing-icon="nextIcon"
      :loading="loading"
      :disabled="disabled || loading"
      class="font-semibold rounded-lg px-6"
    >
      {{ nextLabel }}
    </UButton>
  </div>
</template>
