<script setup lang="ts">
import type { Review } from '~~/shared/types/review'

const props = defineProps<{
  rating: number
  total: number
  reviews: Review[]
}>()

const breakdown = computed(() => {
  const counts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: props.reviews.filter((r) => r.rating === stars).length,
  }))
  return counts.map((row) => ({
    stars: row.stars,
    pct: props.total > 0 ? Math.round((row.count / props.reviews.length) * 100) : 0,
  }))
})

const visibleCount = ref(3)

function loadMore() {
  visibleCount.value += 3
}

const visibleReviews = computed(() => props.reviews.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < props.reviews.length)
</script>

<template>
  <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
    <h2 class="flex items-center gap-2 text-lg font-bold text-blue-500 mb-6">
      <Icon name="mdi:comment-quote-outline" class="text-orange-400 text-xl" />
      Avaliações de Clientes
    </h2>

    <!-- Rating summary -->
    <div class="flex gap-8 mb-8 items-center">
      <div class="text-center shrink-0">
        <p class="text-6xl font-bold text-blue-500 leading-none">{{ rating }}</p>
        <div class="flex justify-center text-orange-400 my-2">
          <Icon v-for="i in 5" :key="i" name="mdi:star" class="text-lg" />
        </div>
        <p class="text-xs text-slate-400">Baseado em {{ total }} avaliações</p>
      </div>

      <div class="flex-1 space-y-2">
        <div v-for="row in breakdown" :key="row.stars" class="flex items-center gap-3 text-xs text-slate-500">
          <span class="w-14 text-right shrink-0">{{ row.stars }} estrelas</span>
          <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div class="h-2 rounded-full bg-orange-400 transition-all duration-500" :style="{ width: `${row.pct}%` }" />
          </div>
          <span class="w-8 shrink-0 text-slate-400">{{ row.pct }}%</span>
        </div>
      </div>
    </div>

    <!-- Review cards -->
    <div class="space-y-4">
      <div v-for="review in visibleReviews" :key="review.id" class="border border-gray-100 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <img :src="review.avatar" :alt="review.name"
              class="w-10 h-10 rounded-full object-cover border border-gray-100" />
            <div>
              <p class="text-sm font-bold text-blue-500">{{ review.name }}</p>
              <p class="text-xs text-slate-400">{{ review.timeAgo }}</p>
            </div>
          </div>
          <div class="flex text-orange-400">
            <Icon v-for="i in 5" :key="i" :name="i <= review.rating ? 'mdi:star' : 'mdi:star-outline'"
              class="text-base" />
          </div>
        </div>
        <p class="text-sm text-slate-600 leading-relaxed italic">{{ review.text }}</p>
      </div>
    </div>

    <button v-if="hasMore"
      class="mt-5 w-full py-3 text-sm font-semibold text-blue-900 border border-gray-200 rounded-xl hover:border-orange-400 hover:text-orange-500 transition-all"
      @click="loadMore">
      Carregar mais avaliações
    </button>
  </div>
</template>
