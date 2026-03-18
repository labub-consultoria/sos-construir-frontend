<script setup lang="ts">

export interface HeroSectionProps {
  badgeText?: string
  badgeAvatars?: string[]
  titleDark?: string
  titleOrange?: string
  subtitle?: string
  searchPlaceholder?: string
  popularTags?: {
    name: string,
    slug: string
  }[]
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
    'Da visita técnica ao acabamento, a SOS Construir assume tudo. Profissionais qualificados, materiais de primeira linha e garantia integral do início ao fim.',
  searchPlaceholder: 'O que você procura? (ex: Pintor, Piso...)',
  popularTags: [{
    name: 'Pintor',
    slug: 'pintor'
  },
  {
    name: 'Metalúrgico',
    slug: 'metalurgico'
  }, {
    name: 'Energia Solar',
    slug: 'energia-solar'
  },
  {
    name: 'Telhado',
    slug: 'reforma-de-telhado'
  }
  ],
  mainImage:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop', // Imagem de obra genérica
  floatingCard: {
    rating: 5,
    text: '"Entregaram no prazo, com qualidade e sem nenhuma dor de cabeça."',
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
// Input
const { searchQuery, suggestions, clearSearch } = useServices()

const showSuggestions = computed({
  get: () => suggestions.value.length > 0,
  set: (isOpen) => {
    if (!isOpen) {
      clearSearch()
    }
  }
})
const handleSelect = (slug: string) => {
  clearSearch()
  navigateTo(`/servicos/${slug}`)
}

const handleSearch = () => {
  console.log('handle search activated')
  const first = suggestions.value[0]
  if (first) {
    handleSelect(first.slug)
  }
}

</script>

<template>
  <section class="relative pt-24 pb-16 lg:pt-10 lg:pb-10 overflow-hidden" :class="section.bgSection">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div class="flex flex-col items-start z-10">
          <HeroChip :users="users" />

          <h1 class="text-[2.5rem] sm:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span class="text-blue-500 block mb-2">{{ section.titleDark }}</span>
            <span class="text-orange-500 block">{{ section.titleOrange }}</span>
          </h1>

          <p class="text-gray-500 text-lg mb-10 max-w-lg leading-relaxed">
            {{ section.subtitle }}
          </p>
          <!-- input -->
          <div class="w-full max-w-xl relative">
            <UPopover v-model:open="showSuggestions" :dismissible="true"
              :ui="{ content: 'w-(--reka-popper-anchor-width) ' }">
              <template #anchor>
                <div class="w-full bg-white rounded-2xl shadow-md border border-gray-100 flex items-center">
                  <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass-20-solid"
                    :placeholder="section.searchPlaceholder" size="xl" color="secondary" variant="none"
                    class="grow bg-transparent border-none outline-none py-3 text-sm sm:text-base"
                    @keyup.enter="handleSearch" @keyup.escape="clearSearch">
                    <template #default>
                      <UButton color="primary" variant="solid" size="xl"
                        class="font-bold mr-2 sm:px-6 sm:py-3 rounded-xl transition-colors text-white"
                        @click="handleSearch">
                        Buscar
                      </UButton>
                    </template>
                  </UInput>
                </div>
              </template>

              <template #content>
                <ul
                  class=" bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-64 
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 overflow-y-auto">
                  <li v-for="service in suggestions" :key="service.slug" class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50
               transition-colors border-b border-gray-50 last:border-none" @click="handleSelect(service.slug)">
                    <UIcon :name="service.icon" class="text-orange-500 bg-orange-500 text-xl shrink-0" />
                    <div class="flex flex-col min-w-0">
                      <span class="font-semibold text-blue-500 text-sm">{{ service.name }}</span>
                      <span class="text-xs text-gray-500 truncate">{{ service.description }}</span>
                    </div>
                    <UIcon name="mdi:arrow-right" class="ml-auto text-gray-500 shrink-0" />
                  </li>
                </ul>
              </template>
            </UPopover>
          </div>

          <!-- tags populares -->
          <div class="flex flex-wrap md:items-center gap-2 text-sm pt-3 pl-2 w-full">
            <span class="text-gray-400 h-auto">Populares:</span>
            <template v-for="tag, i in section.popularTags" :key="tag">
              <ULink :to="'servicos/' + tag.slug"
                class="underline text-orange-400 hover:text-orange-500 hover:underline font-medium transition-colors">
                {{ tag.name }}
              </ULink>
              <span v-if="i !== section.popularTags.length - 1"> • </span>
            </template>
          </div>
        </div>
        <div class="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] mt-8 lg:mt-0">
          <img :src="section.mainImage" alt="Obra perfeita" class="w-full h-full object-cover rounded-3xl shadow-2xl" />

          <div v-if="section.floatingCard"
            class="absolute -bottom-6 left-4 lg:-left-10 sm:bottom-12 bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[260px] animate-fade-in-up">
            <div class="flex gap-1 mb-3">
              <Icon v-for="i in 5" :key="i" name="mdi:star-outline" class="text-orange-500 text-lg"
                :class="{ 'text-orange-500': i <= section.floatingCard.rating }" />
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
