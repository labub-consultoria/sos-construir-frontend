<script setup lang="ts">
const defaultSection: BaseSection = {
  title: 'Nossos Profissionais Especializados',
  description: 'Escolha entre mais de 100 profissionais certificados.',
  ctaText: 'Explorar todos os profissionais',
  ctaLink: '/profissionais',
}
const props = defineProps<{
  section?: Partial<BaseSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))

const { professionals, loading } = useProfessionals({ limit: 2, syncUrl: false })
</script>

<template>
  <section class="py-16 w-full" :class="props.section?.bgSection">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-4 flex flex-col">
          <h2 class="title-section">
            {{ section.title }}
          </h2>
          <p class="text-section-subtitle mb-8 leading-relaxed">
            {{ section.description }}
          </p>
          <div class="hidden lg:block">
            <div class="rounded-xl p-6 mb-8 border border-gray-100">
              <ul class="space-y-4">
                <li class="flex items-center gap-3">
                  <div class="bg-orange-500 p-1 w-6 h-6 rounded-full text-white flex items-center justify-center">
                    <Icon name="mdi:check-bold" />
                  </div>
                  <span class="font-medium text-blue-700 text-sm">+500 Profissionais Disponíveis</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="bg-orange-500 p-1 w-6 h-6 rounded-full text-white flex items-center justify-center">
                    <Icon name="mdi:shield-check-outline" />
                  </div>
                  <span class="font-medium text-blue-700 text-sm">Garantia Integral de Qualidade</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="bg-orange-500 p-1 w-6 h-6 rounded-full text-white flex items-center justify-center">
                    <Icon name="mdi:star" />
                  </div>
                  <span class="font-medium text-blue-700 text-sm">Avaliações Reais de Clientes</span>
                </li>
              </ul>
            </div>

            <UButton color="primary" variant="outline" size="lg" :to="section.ctaLink"
              class="w-full flex justify-center py-3 rounded-lg font-bold transition-colors">
              {{ section.ctaText }}
              <template #trailing>
                <Icon name="mdi:arrow-right" class="text-xl" />
              </template>
            </UButton>
          </div>
        </div>

        <div class="lg:col-span-8 flex flex-col gap-6">
          <div v-if="loading" class="space-y-6">
            <div v-for="i in 2" :key="i" class="bg-white border border-gray-100 rounded-2xl p-6 h-48 md:h-62 flex">
              <USkeleton class="w-16 h-16 rounded-full mr-4" />
              <div class="flex-1 space-y-4 py-1">
                <USkeleton class="h-4 rounded w-3/4" />
                <div class="space-y-2">
                  <USkeleton class="h-4 rounded" />
                  <USkeleton class="h-4 rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>

          <template v-else>
            <ProfessionalCard v-for="prof in professionals" :key="prof.id" :professional="prof" />
          </template>
        </div>

        <div class="block lg:hidden">
          <div class="rounded-xl p-6 mb-8 border border-gray-100">
            <ul class="space-y-4">
              <li class="flex items-center gap-3">
                <div class="bg-orange-500 p-1 w-6 h-6 rounded-full text-white flex items-center justify-center">
                  <Icon name="mdi:check-bold" />
                </div>
                <span class="font-medium text-blue-700 text-sm">+500 Profissionais Disponíveis</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="bg-orange-500 p-1 w-6 h-6 rounded-full text-white flex items-center justify-center">
                  <Icon name="mdi:shield-check-outline" />
                </div>
                <span class="font-medium text-blue-700 text-sm">Garantia Integral de Qualidade</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="bg-orange-500 p-1 w-6 h-6 rounded-full text-white flex items-center justify-center">
                  <Icon name="mdi:star" />
                </div>
                <span class="font-medium text-blue-700 text-sm">Avaliações Reais de Clientes</span>
              </li>
            </ul>
          </div>

          <UButton color="primary" variant="outline" size="lg" :to="section.ctaLink"
            class="w-full flex justify-center py-3 rounded-lg font-bold transition-colors">
            {{ section.ctaText }}
            <template #trailing>
              <Icon name="mdi:arrow-right" class="text-xl" />
            </template>
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
