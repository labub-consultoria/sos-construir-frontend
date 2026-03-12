<script setup lang="ts">
export interface StatItem {
  value: string
  labelTop: string
  labelBottom: string
}

export interface StatsSection {
  bgSection?: string
  stats?: StatItem[]
}

const defaultSection: StatsSection = {
  bgSection: 'bg-section-bg-1',
  stats: [
    {
      value: '120+',
      labelTop: 'Profissionais',
      labelBottom: 'Verificados'
    },
    {
      value: '1.5k',
      labelTop: 'Projetos',
      labelBottom: 'Realizados'
    },
    {
      value: '4.9',
      labelTop: 'Nota Média',
      labelBottom: 'de Avaliação'
    },
    {
      value: '100%',
      labelTop: 'Garantia de',
      labelBottom: 'Satisfação'
    }
  ]
}
const props = defineProps<{
  section?: Partial<StatsSection>
}>()

const section = computed(() => ({
  ...defaultSection,
  ...props.section
}))
</script>

<template>
  <section
    class="py-10 w-full border-y border-gray-100/50"
    :class="section.bgSection"
  >
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 divide-x-0 lg:divide-x lg:divide-gray-200/60">
        <div
          v-for="(stat, index) in section.stats"
          :key="stat.value"
          class="flex items-center justify-center lg:justify-center gap-3 md:gap-4"
          :class="{ 'lg:pl-6': index !== 0 }"
        >
          <span class="text-xl md:text-3xl font-extrabold text-orange-500 tracking-tight">
            {{ stat.value }}
          </span>

          <div class="flex flex-col text-sm md:text-sm text-section-subtitle font-semibold leading-snug">
            <span>{{ stat.labelTop }}</span>
            <span>{{ stat.labelBottom }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
