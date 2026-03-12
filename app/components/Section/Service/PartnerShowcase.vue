<script setup lang="ts">
import type { PartnerSection } from '~/types/servicePage'

const props = defineProps<{
  section: PartnerSection
}>()
</script>

<template>
  <section class="py-16 w-full" :class="section?.bgSection">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
          <img
            :src="props.section.coverImage"
            :alt="`Fachada do parceiro ${props.section.partnerName}`"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex flex-col justify-center">
          <span class="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3">
            Parceria Oficial
          </span>
          <h2 class="title-section mb-6">
            Os Melhores Materiais <br class="hidden lg:block" />
            <span class="text-orange-500">Direto da Fábrica</span>
          </h2>

          <p class="text-section-subtitle text-lg mb-8 leading-relaxed">
            {{ props.section.description }}
          </p>

          <ul class="space-y-4 mb-8">
            <li
              v-for="(tag, index) in props.section.tags"
              :key="index"
              class="flex items-start gap-3"
            >
              <Icon :name="'mdi:' + tag.icon" class="text-orange-500 text-xl flex-shrink-0 mt-1" />
              <span class="text-blue-600 font-medium">
                {{ tag.text }}
              </span>
            </li>
          </ul>

          <div>
            <UButton
              color="primary"
              variant="solid"
              size="xl"
              class="text-white font-bold px-8 py-3 rounded-lg"
            >
              {{ props.section.cta }}
              <template #trailing>
                <Icon name="mdi:arrow-right" class="text-xl" />
              </template>
            </UButton>
          </div>

          <div
            class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-section-subtitle"
          >
            <div class="flex items-center gap-2">
              <Icon name="mdi:home-outline" class="text-orange-500 text-xl" />
              <span>{{ props.section.footerInfo.usage }}</span>
            </div>
            <div
              class="border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold bg-gray-50 flex items-center gap-2"
            >
              {{ props.section.footerInfo.guarantee }}
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-section-bg-1 flex items-center gap-4">
            <img
              :src="props.section.logo"
              :alt="`Logo ${props.section.partnerName}`"
              class="h-12 w-auto object-contain"
            />
            <div>
              <p class="font-bold text-blue-500 text-lg">
                {{ props.section.partnerName }}
              </p>
              <p class="text-xs text-section-subtitle uppercase tracking-widest mt-0.5">
                Parceiro Oficial
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
