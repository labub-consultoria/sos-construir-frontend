<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const _props = defineProps<{
  beforeImageUrl: string
  afterImageUrl: string
  // Aspecto padrão (ex: 2/3 para vertical, 16/9 para horizontal)
  aspectRatio?: string
}>()

const containerRef = ref<HTMLElement | null>(null)
const sliderPercentage = ref(50) // Porcentagem de visibilidade da imagem do 'Depois'
const isResizing = ref(false) // Controla se o mouse está sendo arrastado

// Função para atualizar a porcentagem baseada na posição do mouse dentro do container
const updatePercentage = (clientX: number) => {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const offset = clientX - rect.left
  const percentage = (offset / rect.width) * 100

  // Limita entre 0% e 100%
  sliderPercentage.value = Math.max(0, Math.min(percentage, 100))
}

// Inicia o arrasto
const onMouseDown = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
}

// Termina o arrasto
const onMouseUp = () => {
  isResizing.value = false
}

// Evento de movimento global (fora do componente)
const onMouseMoveGlobal = (e: MouseEvent) => {
  if (!isResizing.value) return
  updatePercentage(e.clientX)
}

// Touch events para mobile
const onTouchStart = (_e: TouchEvent) => {
  isResizing.value = true
}

const onTouchMove = (e: TouchEvent) => {
  if (!isResizing.value) return
  const touch = e.touches?.[0]
  if (!touch) return
  updatePercentage(touch.clientX)
}

const onTouchEnd = () => {
  isResizing.value = false
}

// Gerenciamento de eventos globais
onMounted(() => {
  window.addEventListener('mousemove', onMouseMoveGlobal)
  window.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMoveGlobal)
  window.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full rounded-2xl overflow-hidden group select-none cursor-ew-resize touch-none"
    :style="{ aspectRatio: aspectRatio || '2/3' }"
    @mousedown.stop="onMouseDown"
    @touchstart.stop="onTouchStart"
    @touchmove.stop="onTouchMove"
    @touchend.stop="onTouchEnd"
  >
    <img
      :src="beforeImageUrl"
      alt="Projeto Antes"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <img
      :src="afterImageUrl"
      alt="Projeto Depois"
      class="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-75"
      :style="{ clipPath: `inset(0 0 0 ${sliderPercentage}%)` }"
    />
    <div
      class="absolute bottom-4 left-4 z-20 bg-black text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest opacity-70"
    >
      Antes
    </div>
    <div
      class="absolute bottom-4 right-4 z-20 bg-black text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest opacity-70"
    >
      Depois
    </div>

    <div
      class="absolute top-0 bottom-0 z-30 transition-all duration-75"
      :style="{ left: `${sliderPercentage}%` }"
    >
      <div class="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-white opacity-80 shadow-md" />

      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-lg border-2 border-white scale-100 group-hover:scale-110 transition-transform"
      >
        <Icon name="mdi:chevron-left-right" class="text-white text-xl" />
      </div>
    </div>
  </div>
</template>
