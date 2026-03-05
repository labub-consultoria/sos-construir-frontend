<script setup>
defineProps({
  title: String,
  subtitle: String,
  img: String
})
</script>

<template>
  <h1>
    {{ title }}
  </h1>
  <h2>
    {{ subtitle }}
  </h2>
</template>
