<script setup lang="ts">
import { ref } from 'vue'

export interface HeroSectionProps {
  badgeText?: string
  badgeAvatars?: string[]
  titleDark?: string
  titleOrange?: string
  subtitle?: string
  searchPlaceholder?: string
  popularTags?: string[]
  mainImage?: string
  floatingCard?: {
    rating: number
    text: string
    authorName: string
    authorAvatar: string
  }
  bgSection?: string
}

const defaultSection = {
  badgeText: 'Escolhido por 1000+ clientes',
  badgeAvatars: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
  ],
  titleDark: 'Sua Obra Perfeita',
  titleOrange: 'Começa Aqui',
  subtitle:
    'Conectamos você aos melhores arquitetos, empreiteiros e fornecedores. Garantia de qualidade e pagamentos seguros.',
  searchPlaceholder: 'O que você procura? (ex: Pintor, Piso...)',
  popularTags: ['Pintura', 'Elétrica', 'Design'],
  mainImage:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop', // Imagem de obra genérica
  floatingCard: {
    rating: 5,
    text: '"Excelente trabalho na reforma da minha cozinha!"',
    authorName: 'Ana S.',
    authorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
  },
  bgSection: 'bg-[#FAFAFA]',
}
const props = defineProps<{
  section?: Partial<HeroSectionProps>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))

const users = [
  {
    id: 2,
    name: 'Rodrigo Goes',
    avatar: 'https://i.pravatar.cc/100?img=1',
  },
  {
    id: 1,
    name: 'Ronaldo Silva',
    avatar: 'https://i.pravatar.cc/100?img=2',
  },
  {
    id: 3,
    name: 'Roger Guedes',
    avatar: 'https://i.pravatar.cc/100?img=3',
  },
]
const searchQuery = ref('')

const handleSearch = () => {
  // Lógica de busca aqui (redirecionar para página de resultados, etc)
  console.log('Buscando por:', searchQuery.value)
}
</script>

<template>
  <section
    class="relative pt-24 pb-16 lg:pt-10 lg:pb-10 overflow-hidden"
    :class="section.bgSection"
  >
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div class="flex flex-col items-start z-10">
          <HeroChip :users="users" />

          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            <span class="text-blue-500 block mb-2">{{ section.titleDark }}</span>
            <span class="text-orange-500 block">{{ section.titleOrange }}</span>
          </h1>

          <p class="text-gray-500 text-lg mb-10 max-w-lg leading-relaxed">
            {{ section.subtitle }}
          </p>
          <div
            class="w-full max-w-xl bg-white rounded-2xl shadow- border border-gray-100 flex items-center mb-6 shadow-md"
          >
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass-20-solid"
              :placeholder="section.searchPlaceholder"
              size="xl"
              color="secondary"
              variant="none"
              class="grow bg-transparent border-none outline-none py-3 text-sm sm:text-base"
            >
              <template #default>
                <UButton
                  color="primary"
                  variant="solid"
                  size="xl"
                  class="font-bold mr-2 sm:px-6 sm:py-3 rounded-xl transition-colors text-white"
                  @click="handleSearch"
                >
                  Buscar
                </UButton>
              </template>
            </UInput>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-400">Populares:</span>
            <div class="flex gap-3">
              <a
                v-for="tag in section.popularTags"
                :key="tag"
                href="#"
                class="underline text-orange-400 hover:text-orange-500 hover:underline font-medium transition-colors"
              >
                {{ tag }}
              </a>
            </div>
          </div>
        </div>

        <div class="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] mt-8 lg:mt-0">
          <img
            :src="section.mainImage"
            alt="Obra perfeita"
            class="w-full h-full object-cover rounded-3xl shadow-2xl"
          />

          <div
            v-if="section.floatingCard"
            class="absolute -bottom-6 left-4 lg:-left-10 sm:bottom-12 bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[260px] animate-fade-in-up"
          >
            <div class="flex gap-1 mb-3">
              <Icon
                v-for="i in 5"
                :key="i"
                name="mdi:star-outline"
                class="text-orange-500 text-lg"
                :class="{ 'text-orange-500': i <= section.floatingCard.rating }"
              />
            </div>
            <p class="text-orange-500 font-bold text-sm leading-snug mb-4">
              {{ section.floatingCard.text }}
            </p>
            <div class="flex items-center gap-3">
              <UAvatar :src="section.floatingCard.authorAvatar" />
              <span class="text-xs font-medium text-gray-500">
                {{ section.floatingCard.authorName }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Pequena animação para o card flutuante aparecer de forma suave */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
