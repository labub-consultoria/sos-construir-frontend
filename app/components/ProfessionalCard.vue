<script setup lang="ts">

const props = defineProps<{
  professional: ProfessionalCard
}>()

const to = computed(() => `/profissionais/${props.professional.id}`)
// Mantemos a limitação para exibir no card, mas usaremos todas as fotos no lightbox
const portfolioLimited = computed(() => props.professional.portfolioUrls.slice(0, 6))
const specialtiesLimited = computed(() => props.professional.specialties.slice(0, 3))

// --- Lógica para o Lightbox ---
const isLightboxOpen = ref(false)
const lightboxStartIndex = ref(0)
// Estado reativo para saber quais imagens exibir no lightbox (avatar ou portfólio)
const lightboxImages = ref<string[]>([])

// Função para abrir o lightbox com o portfólio
function openPortfolioGallery(index: number) {
  // Passamos todas as imagens do portfólio para o lightbox, não apenas as 6 limitadas
  lightboxImages.value = props.professional.portfolioUrls
  lightboxStartIndex.value = index
  isLightboxOpen.value = true
}

// Função para abrir o lightbox apenas com o avatar
function openAvatarLightbox() {
  lightboxImages.value = [props.professional.avatarUrl] // Passa o avatar como uma galeria de uma única imagem
  lightboxStartIndex.value = 0 // Começa na primeira (e única) imagem
  isLightboxOpen.value = true
}
</script>

<template>
  <div
    class="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow min-h-[250px]">
    <div v-if="professional.isTopRated"
      class="absolute -top-3 left-6 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
      Mais bem avaliado
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 h-full min-h-40">
      <div class="md:col-span-4 flex flex-col justify-between">
        <div class="flex items-center gap-4 mb-4">
          <div class="rounded-full border-3 border-orange-500 cursor-pointer group" @click="openAvatarLightbox">
            <NuxtImg :src="professional.avatarUrl" :alt="professional.name"
              class="w-18 rounded-full object-cover border-3 border-white group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <h3 class="font-bold text-blue-700 text-lg">
              {{ professional.name }}
            </h3>
            <p class="text-xs text-gray-500 mb-1">
              {{ professional.yearsExperience }} anos de experiência
            </p>
            <div class="flex items-center gap-1 text-sm">
              <div class="flex text-orange-400">
                <Icon v-for="i in 4" :key="i" name="mdi:star" class="text-base" />
                <Icon name="mdi:star-half-full" class="text-base" />
              </div>
              <span class="font-medium text-blue-700 ml-1">{{ professional.rating }}</span>
              <span class="text-gray-500 text-xs">({{ professional.reviewCount }})</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 text-sm text-section-subtitle font-medium">
          <div class="flex items-center gap-2">
            <Icon name="mdi:tools" class="text-orange-500 text-lg" />
            {{ professional.jobsCompleted }} obras realizadas
          </div>
          <div class="flex items-center gap-2">
            <Icon name="mdi:emoticon-happy-outline" class="text-orange-500 text-lg" />
            {{ professional.satisfactionRate }}% de satisfação
          </div>
        </div>
      </div>

      <div
        class="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
        <div class="mb-4">
          <p class="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2">
            Verificações
          </p>
          <ul class="space-y-2 text-sm font-medium text-blue-700">
            <li v-for="(verif, idx) in professional.verifications" :key="idx" class="flex items-center gap-2">
              <div>
                <Icon :name="verif.type === 'success' ? 'mdi:check-circle' : 'mdi:shield-check'"
                  :class="verif.type === 'success' ? 'text-green-600' : 'text-orange-500'" class="text-lg shrink-0" />
              </div>
              {{ verif.text }}
            </li>
          </ul>
        </div>

        <div>
          <p class="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2">
            Especialidades
          </p>
          <div class="flex flex-wrap gap-2">
            <span v-for="spec in specialtiesLimited" :key="spec"
              class="bg-gray-50 text-section-subtitle text-xs px-2.5 py-1 rounded-md font-medium border border-gray-100">
              {{ spec }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
        <div class="mb-4">
          <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
            Portfólio Recente
          </p>
          <div class="flex gap-2 flex-wrap">
            <NuxtImg v-for="(img, idx) in portfolioLimited" :key="idx" :src="img"
              class="w-16 h-16 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              alt="Projeto recente" @click="openPortfolioGallery(idx)" />
          </div>
        </div>

        <UButton color="primary" variant="solid"
          class="w-full text-white font-bold py-2.5 flex justify-center rounded-lg transition-colors" :to="to">
          Ver Perfil e Orçar
        </UButton>
      </div>
    </div>

    <AppLightbox v-model:open="isLightboxOpen" :images="lightboxImages" :start-index="lightboxStartIndex" />
  </div>
</template>
