<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  images: string[]
  startIndex?: number
}>()

const currentIndex = ref(0)

watch(isOpen, (newVal) => {
  if (newVal) {
    currentIndex.value = props.startIndex || 0
  }
})

function prev() {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (!isOpen.value) return
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <UModal v-model:open="isOpen" fullscreen :ui="{ content: 'bg-black/80' }">
    <template #content>
      <div class="relative flex items-center justify-center w-full h-full" @click.self="isOpen = false">

        <button class="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors"
          @click="isOpen = false">
          <Icon name="mdi:close" class="text-3xl" />
        </button>

        <button v-if="images.length > 1"
          class="absolute left-4 md:left-8 z-50 text-white/70 hover:text-white transition-colors" @click="prev">
          <Icon name="mdi:chevron-left" class="text-5xl md:text-7xl" />
        </button>

        <img v-if="images.length" :src="images[currentIndex]" alt="Visualização"
          class="max-w-full max-h-screen object-contain p-4 md:p-12 cursor-default" />

        <button v-if="images.length > 1"
          class="absolute right-4 md:right-8 z-50 text-white/70 hover:text-white transition-colors" @click="next">
          <Icon name="mdi:chevron-right" class="text-5xl md:text-7xl" />
        </button>

        <p v-if="images.length > 1" class="absolute bottom-4 text-white/50 text-sm pointer-events-none">
          {{ currentIndex + 1 }} / {{ images.length }}
        </p>
      </div>
    </template>
  </UModal>
</template>