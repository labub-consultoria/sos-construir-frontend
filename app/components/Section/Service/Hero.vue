<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const defaultSection: ServiceHeroSection = {
  title: 'Se ficar com alguma dúvida',
  description: 'Entre em contato com nossa equipe',
  primaryCta: {
    text: 'Solicitar Orçamento',
    link: DEFAULT_CTA_WHATSAPP_LINK,
    icon: 'mdi:chat-outline',
  },
  secondaryCta: {
    text: 'Ver profissionais disponíveis',
    link: '/profissionais',
    icon: 'mdi:arrow-right',
  },
  features: [
    {
      text: 'Profissionais certificados',
      icon: 'mdi:lightning-bolt'
    },
    {
      text: 'Garantia integral',
      icon: 'mdi:shield-check-outline'
    },
    {
      text: 'Sem taxa escondida',
      icon: 'mdi:check'
    }
  ]
}

const props = defineProps<{
  section?: Partial<ServiceHeroSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section,
}))

const route = useRoute()

// Imagem explícita (ex.: /sobre) tem prioridade; senão resolve o hero do serviço
// por convenção do slug (Supabase). Sem imagem → hero branco (sem <img>).
const cfg = useRuntimeConfig().public
const heroFailed = ref(false)
const heroUrl = computed(() => section.value.image || serviceImageUrl(cfg.supabaseUrl, cfg.supabaseBucket, String(route.params.slug ?? ''), 'hero'))

// Lógica para montar o Breadcrumb baseado na URL
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const paths = route.path.split('/').filter(Boolean)

  const items: BreadcrumbItem[] = [
    { label: 'Home', to: '/' }
  ]

  let currentPath = ''

  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const isLast = index === paths.length - 1
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')

    items.push({
      label,
      to: isLast ? undefined : currentPath
    })
  })

  return items
})

const formattedTitle = computed(() => {
  const title = section.value?.title ?? ''
  return title.replace(/(Dor de Cabeça)/gi, '<span class="text-orange-500">$1</span>')
})
</script>

<template>

  <section class="relative w-full min-h-[600px] flex items-center bg-white overflow-hidden">
    <!-- hero img desktop -->
    <!-- img mobile -->
    <div class="absolute inset-0 z-0 justify-end hidden md:flex">
      <NuxtImg v-if="!heroFailed" :src="heroUrl" alt="Profissional trabalhando" @error="heroFailed = true"
        class=" w-full md:w-3/4 lg:w-2/3 h-full object-cover object-right" />
      <div
        class="absolute inset-0 z-0 bg-gradient-to-r from-white via-white to-white/50 xl:from-20% xl:via-50% xl:to-70% md:to-transparent" />
    </div>

    <div class="container max-w-7xl mx-auto px-4 py-6 relative z-10">
      <div class="max-w-3xl flex flex-col items-start gap-6 z-10">
        <UBreadcrumb :items="breadcrumbItems" class="" />

        <h1 class="text-blue-500 text-[2.5rem] sm:text-6xl font-extrabold tracking-tight leading-[1.1] "
          v-html="formattedTitle" />

        <p class="text-section-subtitle text-lg mb-2 max-w-lg">
          {{ section.description }}
        </p>
        <div v-if="!heroFailed" class="w-full h-[250px] sm:h-[450px] md:hidden">
          <NuxtImg :src="heroUrl" alt="Profissional trabalhando" @error="heroFailed = true"
            class="w-full h-full object-cover object-center rounded-xl" />
        </div>

        <ul class="space-y-3 mb-5">
          <li v-for="feature of section.features" :key="feature.text"
            class="flex items-center gap-3 text-section-subtitle font-medium">
            <Icon :name="feature.icon" class="text-orange-500 text-xl" />
            {{ feature.text }}
          </li>
        </ul>

        <div v-if="section.primaryCta && section.secondaryCta"
          class="flex flex-col gap-4 items-start w-full items-center text-center sm:items-start sm:flex-row ">
          <UButton color="primary" variant="solid" size="xl" :to="section.primaryCta.link"
            class="font-bold rounded-lg px-8 py-3 w-full sm:w-auto justify-center text=center "
            :icon="section.primaryCta.icon">
            {{ section.primaryCta.text }}
          </UButton>

          <UButton color="primary" variant="ghost" size="xl" :to="section.secondaryCta.link"
            class="font-semibold  text-sm rounded-lg px-8 py-3 w-full text-center justify-center transition-colors sm:w-auto "
            :trailing-icon="section.secondaryCta.icon">
            {{ section.secondaryCta.text }}
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>