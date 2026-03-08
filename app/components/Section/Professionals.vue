<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type Professional from '~/types/profissional'
import type { BaseSection } from '~/types/sections'

const props = defineProps<{
  section: BaseSection
}>()

const professionals = ref<Professional[]>([])
const loading = ref(true)

// Mock
const fetchProfessionalsFromApi = async () => {
  loading.value = true
  // Simulando
  await new Promise(resolve => setTimeout(resolve, 1000))

  professionals.value = [
    {
      id: 1,
      name: 'Roberto Silva',
      experience: '8 anos de experiência',
      rating: 4.8,
      reviews: 127,
      jobsCompleted: '150+',
      satisfaction: '98%',
      avatar: 'https://i.pravatar.cc/150?img=11',
      isTopRated: true,
      verifications: [
        { text: 'Profissional Verificado SOS', type: 'success' },
        { text: 'Garantia Integral SOS', type: 'warning' }
      ],
      specialties: ['Pintura Interna', 'Grafitti', 'Impermeabilização'],
      portfolio: [
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=150&auto=format&fit=crop'
      ]
    },
    {
      id: 2,
      name: 'Gabriel Almeida',
      experience: '5 anos de experiência',
      rating: 4.8,
      reviews: 127,
      jobsCompleted: '120+',
      satisfaction: '96%',
      avatar: 'https://i.pravatar.cc/150?img=12',
      isTopRated: false,
      verifications: [
        { text: 'Profissional Verificado SOS', type: 'success' },
        { text: 'Garantia Integral SOS', type: 'warning' }
      ],
      specialties: ['Pintura Residencial', 'Texturas', 'Massa Corrida'],
      portfolio: [
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=150&auto=format&fit=crop'
      ]
    }
  ]
  loading.value = false
}

// Busca os dados quando o componente é montado na tela
onMounted(() => {
  fetchProfessionalsFromApi()
})
</script>

<template>
  <section
    class="py-16 w-full"
    :class="props.section?.bgSection"
  >
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-4 flex flex-col">
          <h2 class="title-section">
            {{ props.section.title }}
          </h2>
          <p class="text-section-subtitle mb-8 leading-relaxed">
            {{ props.section.description }}
          </p>
          <div class="hidden lg:block">
            <div class=" rounded-xl p-6 mb-8 border border-gray-100">
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

            <UButton
              color="primary"
              variant="outline"
              size="lg"
              class="w-full flex justify-center py-3 rounded-lg font-bold transition-colors"
            >
              Explorar todos os profissionais
              <template #trailing>
                <Icon
                  name="mdi:arrow-right"
                  class="text-xl"
                />
              </template>
            </UButton>
          </div>
        </div>

        <div class="lg:col-span-8 flex flex-col gap-6">
          <div
            v-if="loading"
            class="space-y-6"
          >
            <div
              v-for="i in 2"
              :key="i"
              class="bg-white border border-gray-100 rounded-2xl p-6 h-48 md:h-62 flex"
            >
              <USkeleton class="w-16 h-16 rounded-full mr-4" />
              <div class="flex-1 space-y-4 py-1">
                <USkeleton class="h-4  rounded w-3/4" />
                <div class="space-y-2">
                  <USkeleton class="h-4 rounded" />
                  <USkeleton class="h-4 rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>

          <template v-else>
            <ProfessionalCard
              v-for="prof in professionals"
              :key="prof.id"
              :professional="prof"
            />
          </template>
        </div>
        <div class="block lg:hidden">
          <div class=" rounded-xl p-6 mb-8 border border-gray-100">
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

          <UButton
            color="primary"
            variant="outline"
            size="lg"
            class="w-full flex justify-center py-3 rounded-lg font-bold transition-colors"
          >
            Explorar todos os profissionais
            <template #trailing>
              <Icon
                name="mdi:arrow-right"
                class="text-xl"
              />
            </template>
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
