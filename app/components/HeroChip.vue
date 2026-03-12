<script setup lang="ts">
import type User from '~/types/user'

defineProps<{
  users: User[]
}>()
</script>

<template>
  <div
    class="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-2 py-1 mb-4 shadow-sm"
  >
    <UAvatarGroup size="2xs">
      <UAvatar
        v-for="user in users"
        :key="user.id"
        :src="user.avatar"
        :alt="user.name"
        loading="lazy"
      />
    </UAvatarGroup>
    <span class="text-xs font-semibold text-orange-600">Escolhido por 1000+ clientes</span>
  </div>
</template>
