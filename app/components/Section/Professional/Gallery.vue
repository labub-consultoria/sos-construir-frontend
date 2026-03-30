<script setup lang="ts">
const showAll = ref(false)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const props = defineProps<{ images: string[] }>()

const visibleImages = computed(() =>
  showAll.value ? props.images : props.images.slice(0, 6)
)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function prev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  lightboxIndex.value = (lightboxIndex.value + 1) % props.images.length
}

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (!lightboxOpen.value) return
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }
  window.addEventListener('keydown', onKey)

  onUnmounted(() => {
    window.removeEventListener('keydown', onKey)
  })
})
</script>

<template>
  <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
    <h2 class="flex items-center gap-2 text-lg font-bold text-blue-500 mb-5">
      <Icon name="mdi:image-multiple-outline" class="text-orange-400 text-xl" />
      Galeria de Trabalhos
    </h2>

    <div class="grid grid-cols-3 gap-3">
      <div v-for="(img, i) in visibleImages" :key="i"
        class="aspect-square rounded-xl overflow-hidden cursor-pointer group relative" @click="openLightbox(i)">
        <NuxtImg :src="img" alt="Trabalho realizado"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div
          class="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-all duration-300 flex items-center justify-center">
          <Icon name="mdi:magnify-plus-outline"
            class="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>

    <UButton v-if="images.length > 6"
      class="mt-4 w-full flex justify-center py-3 rounded-lg font-bold transition-colors" color="primary"
      variant="outline" size="lg" @click="showAll = !showAll">
      {{ showAll ? 'Mostrar menos' : `Ver todas as ${images.length} fotos` }}
    </UButton>

    <!-- Lightbox com Nuxt UI atualizado -->
    <UModal v-model:open="lightboxOpen" fullscreen :ui="{ content: 'bg-black/95' }">
      <template #content>
        <div class="relative flex items-center justify-center w-full h-full">

          <!-- Botão de Fechar Customizado (voltei o seu Icon) -->
          <button class="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors"
            @click="lightboxOpen = false">
            <Icon name="mdi:close" class="text-3xl" />
          </button>

          <!-- Seta Anterior -->
          <button class="absolute left-4 md:left-8 z-50 text-white/70 hover:text-white transition-colors" @click="prev">
            <Icon name="mdi:chevron-left" class="text-5xl md:text-7xl" />
          </button>

          <!-- Imagem -->
          <img :src="images[lightboxIndex]" alt="Trabalho" class="max-w-full max-h-screen object-contain p-4 md:p-12" />

          <!-- Seta Próxima -->
          <button class="absolute right-4 md:right-8 z-50 text-white/70 hover:text-white transition-colors"
            @click="next">
            <Icon name="mdi:chevron-right" class="text-5xl md:text-7xl" />
          </button>

          <!-- Contador -->
          <p class="absolute bottom-4 text-white/50 text-sm">
            {{ lightboxIndex + 1 }} / {{ images.length }}
          </p>
        </div>
      </template>
    </UModal>
  </div>
</template>