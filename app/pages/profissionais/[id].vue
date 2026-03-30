<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const { professional, reviews, error } = useProfessional(route.params.id as string)

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, fatal: true })
}
useSeoMeta({
  title: () => `${professional.value?.name} - ${professional.value?.title}`,
  description: () => professional.value?.bio?.slice(0, 150) + '...',
  ogTitle: () => `${professional.value?.name} - ${professional.value?.title}`,
  ogDescription: () => professional.value?.bio,
  ogImage: () => professional.value?.avatarUrl,
  ogImageAlt: () => `Foto de perfil de ${professional.value?.name}`,
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Home', to: '/' },
  { label: 'Profissionais', to: '/profissionais' },
  { label: professional.value?.name },
])

// lightbox
const isAvatarLightboxOpen = ref(false)
const avatarGallery = computed(() => [
  professional.value?.avatarUrl ?? '/images/avatar-placeholder.png'
])
function openAvatar() {
  isAvatarLightboxOpen.value = true
}

</script>

<template>
  <div v-if="professional" class="min-h-screen bg-gray-50/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div class="mb-8">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <!-- ───── Sidebar ───── -->
        <aside class="w-full lg:w-72 shrink-0 lg:sticky lg:top-6">
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

            <!-- Avatar -->
            <div class="flex flex-col items-center text-center mb-5">
              <div class="relative mb-3">
                <div
                  class="w-28 h-28 rounded-full border-4 border-orange-500 overflow-hidden cursor-pointer group-hover:border-orange-400 transition-colors"
                  @click="openAvatar">
                  <NuxtImg :src="avatarGallery[0]" :alt="professional.name"
                    class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <span v-if="professional.isTopRated"
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                  MAIS BEM AVALIADO
                </span>
              </div>

              <h1 class="text-xl font-bold text-blue-500 mt-3">{{ professional.name }}</h1>
              <p class="text-sm text-slate-500 mb-2">{{ professional.title }}</p>

              <div class="flex items-center gap-1 text-sm justify-center">
                <div class="flex text-orange-400">
                  <Icon v-for="i in 4" :key="i" name="mdi:star" class="text-base" />
                  <Icon name="mdi:star-half-full" class="text-base" />
                </div>
                <span class="font-bold text-blue-500 ml-1">{{ professional.rating }}</span>
                <span class="text-gray-400 text-xs">({{ professional.reviewCount }} avaliações)</span>
              </div>
            </div>

            <!-- Verifications -->
            <ul class="space-y-2 mb-5">
              <li v-for="(v, i) in professional.verifications" :key="i"
                class="flex items-center gap-2 text-sm font-medium text-blue-500">
                <Icon :name="v.type === 'success' ? 'mdi:check-circle' : 'mdi:shield-check'"
                  :class="v.type === 'success' ? 'text-green-500' : 'text-orange-500'" class="text-lg shrink-0" />
                {{ v.text }}
              </li>
            </ul>

            <div class="border-t border-gray-100 pt-4 mb-5 space-y-2">
              <div class="flex items-center gap-2 text-sm text-slate-500">
                <Icon name="mdi:map-marker-outline" class="text-orange-400 shrink-0" />
                {{ professional.locationText }}
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-500">
                <Icon name="mdi:clock-outline" class="text-orange-400 shrink-0" />
                {{ professional.responseTimeText }}
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-500">
                <Icon name="mdi:calendar-check-outline" class="text-orange-400 shrink-0" />
                {{ professional.availabilityText }}
              </div>
            </div>

            <!-- CTAs -->
            <UButton color="primary" block size="lg" class="font-bold mb-3" :to="DEFAULT_CTA_WHATSAPP_LINK">
              Solicitar Orçamento
            </UButton>
          </div>
        </aside>

        <!-- ───── Main content ───── -->
        <div class="flex-1 min-w-0 space-y-6">
          <!-- Sobre mim -->
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 class="flex items-center gap-2 text-lg font-bold text-blue-500 mb-4">
              <Icon name="mdi:account-outline" class="text-orange-400 text-xl" />
              Sobre mim
            </h2>
            <p class="text-slate-600 leading-relaxed text-sm italic">
              {{ professional.bio }}
            </p>
          </div>

          <!-- Especialidades -->
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 class="flex items-center gap-2 text-lg font-bold text-blue-500 mb-4">
              <Icon name="mdi:tools" class="text-orange-400 text-xl" />
              Especialidades
            </h2>
            <div class="flex flex-wrap gap-3">
              <span v-for="spec in professional.specialties" :key="spec"
                class="flex items-center gap-2 bg-orange-50 text-orange-700 text-sm font-medium px-4 py-2 rounded-xl border border-orange-100">
                {{ spec }}
              </span>
            </div>
          </div>

          <!-- Cursos e Certificações -->
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 class="flex items-center gap-2 text-lg font-bold text-blue-500 mb-6">
              <Icon name="mdi:school-outline" class="text-orange-400 text-xl" />
              Cursos e Certificações
            </h2>

            <div class="relative">
              <!-- Timeline line -->
              <div class="absolute my-5 left-5 top-0 bottom-0 w-px bg-orange-100" />

              <div class="space-y-6">
                <div v-for="(course, i) in professional.courses" :key="i" class="flex gap-4 relative">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10">
                    <Icon name="mdi:circle" class="text-orange-400 text-base" />
                  </div>
                  <div class="pt-1.5">
                    <p class="text-sm font-bold text-blue-500">{{ course.name }}</p>
                    <p class="text-xs text-slate-400 mt-0.5">{{ course.institution }} • {{ course.year }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Galeria -->
          <section-professional-gallery :images="professional.portfolioUrls" />

          <!-- Avaliações -->
          <section-professional-reviews :rating="professional.rating" :total="professional.reviewCount" :reviews="reviews" />

        </div>
      </div>
    </div>
    <AppLightbox v-model:open="isAvatarLightboxOpen" :images="avatarGallery || ['']" />
  </div>
</template>
