<script setup lang="ts">
// Template de OG image (1200x630) renderizado via Satori pelo nuxt-og-image.
// Usado por defineOgImage({ component: 'SosConstruir', props: { ... } }).
// Regras do Satori: usar flex em todo container e display explícito em texto.
withDefaults(
  defineProps<{
    title?: string
    description?: string
    label?: string
  }>(),
  {
    title: 'SOS Construir',
    description: '',
    label: ''
  }
)
</script>

<template>
  <div class="w-full h-full flex flex-row bg-white">
    <!-- Faixa de destaque (laranja da marca) -->
    <div class="flex h-full w-[20px] bg-[#f97316]" />

    <div class="flex flex-col justify-between w-full h-full p-[70px]">
      <!-- Cabeçalho: marca -->
      <div class="flex items-center">
        <div
          class="flex items-center justify-center w-[68px] h-[68px] rounded-2xl bg-[#f97316] text-white text-[32px] font-bold"
        >
          SC
        </div>
        <div class="flex flex-col ml-5">
          <span class="text-[34px] font-bold text-[#1e3a8a]">SOS Construir</span>
          <span class="text-[22px] text-[#64748b]">Construção e Reforma em Foz do Iguaçu</span>
        </div>
      </div>

      <!-- Título -->
      <div class="flex flex-col">
        <span
          v-if="label"
          class="flex text-[24px] font-semibold text-[#f97316] mb-3"
          style="text-transform: uppercase; letter-spacing: 2px;"
        >
          {{ label }}
        </span>
        <h1
          class="text-[62px] font-bold text-[#0f172a] m-0 leading-tight"
          style="display: block; text-wrap: balance;"
        >
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="text-[30px] text-[#475569] mt-5 leading-snug"
          style="display: block;"
        >
          {{ description }}
        </p>
      </div>

      <!-- Rodapé: contato -->
      <div class="flex items-center text-[26px] font-semibold text-[#1e3a8a]">
        <span class="flex">sosconstruir.com.br</span>
        <span class="flex mx-4 text-[#cbd5e1]">|</span>
        <span class="flex">(45) 99997-6544</span>
      </div>
    </div>
  </div>
</template>
