<script setup lang="ts">
import type { BlogPost } from '~/types/blogPost'

defineProps<{
  post: BlogPost
}>()
</script>

<template>
  <div
    class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group"
  >
    <div class="w-full h-48 sm:h-56 overflow-hidden">
      <img
        :src="post.image"
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <div class="p-6 md:p-8 flex flex-col flex-grow">
      <span class="text-orange-500 font-bold text-[10px] uppercase tracking-widest mb-3">
        {{ post.category }}
      </span>

      <h3 class="font-bold text-blue-500 text-lg md:text-xl leading-tight mb-6">
        {{ post.title }}
      </h3>

      <NuxtLink
        :to="post.link"
        class="mt-auto inline-flex items-center gap-2 text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors"
      >
        Leia Mais
        <Icon name="mdi:arrow-right" class="text-base" />
      </NuxtLink>
    </div>
  </div>
</template>
