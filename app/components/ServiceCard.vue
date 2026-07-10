<script setup lang="ts">
import { Icon } from '#components'
import type { ServiceCard } from '~~/shared/types/sections'

// `priority`: cards visíveis sem rolagem. Imagem lazy não é vista pelo preload
// scanner e só baixa depois do layout, com prioridade baixa — o que atrasa
// justamente a imagem que o usuário já está olhando.
const props = withDefaults(
  defineProps<{
    card: ServiceCard
    priority?: boolean
  }>(),
  { priority: false }
)

// Cover resolvido por convenção do slug (Supabase). Sem imagem → fundo branco.
const cfg = useRuntimeConfig().public
const coverFailed = ref(false)
const cover = computed(() => serviceImageUrl(cfg.supabaseUrl, cfg.supabaseBucket, props.card.slug, 'cover'))
</script>

<template>
  <NuxtLink :key="card.id" :to="card.link || '#'"
    class="relative rounded-2xl overflow-hidden group transition-all duration-300 md:max-h-[240px]" :class="[
      card.size === 'large' ? 'md:col-span-2' : 'md:col-span-1',
      card.type === 'image'
        ? 'h-[280px] md:h-[240px]'
        : 'h-full md:min-h-[240px] bg-white border border-gray-100 shadow-sm hover:shadow-md',
      coverFailed && 'ring-1 ring-gray-300',
    ]">

    <template v-if="card.type === 'standard'">
      <UCard variant="solid" class="bg-white">
        <template #header>
          <div
            class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
            <Icon :name="card.icon" class="text-orange-500 text-2xl" />
          </div>
        </template>
        <template #footer>
          <div class="p-2 md:p-0 flex flex-col">
            <h3 class="text-lg md:text-xl lg:text-2xl font-bold text-blue-500 mb-3">
              {{ card.name }}
            </h3>
            <p class="text-section-subname text-sm leading-relaxed text-blue-500/60 ">
              {{ card.description }}
            </p>
            <span class="text-orange-500 flex items-center pt-2">
              Saiba Mais
              <Icon name="mdi:arrow-right" />
            </span>
          </div>
        </template>
      </UCard>
    </template>
    <template v-else>
      <UCard class="flex flex-col justify-between h-full">
        <div v-if="coverFailed" class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50/60">
          <Icon :name="card.icon" class="absolute -right-6 -bottom-6 text-[9rem] text-blue-500/[0.06]" />
        </div>
        <NuxtImg v-else :src="cover" :alt="card.name" :loading="priority ? 'eager' : 'lazy'"
          :fetchpriority="priority ? 'high' : 'auto'" @error="coverFailed = true"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95" />
        <div v-if="!coverFailed" class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent z-10" />
        <template #header>
          <div
            class="absolute z-20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors"
            :class="coverFailed ? 'bg-orange-50' : 'bg-black/30 backdrop-blur-md'">
            <Icon :name="card.icon" class="text-orange-500 text-2xl" />
          </div>
        </template>
        <template #footer>
          <div class="absolute bottom-10 z-20 p-2 md:p-0 flex flex-col">
            <h3 class="text-lg md:text-xl lg:text-2xl font-bold mb-3" :class="coverFailed ? 'text-blue-500' : 'text-white'">
              {{ card.name }}
            </h3>
            <p class="text-section-subname text-sm leading-relaxed" :class="coverFailed ? 'text-blue-500/60' : 'text-white/80'">
              {{ card.description }}
            </p>
            <span class="text-orange-500 flex items-center pt-2">
              Saiba Mais
              <Icon name="mdi:arrow-right" />
            </span>
          </div>
        </template>
      </UCard>
    </template>

  </NuxtLink>
</template>
