<template>
  <iframe :src="`${baseUrl}webComponent.html`"></iframe>
</template>
<script setup lang="ts">
const baseUrl = import.meta.env.BASE_URL
</script>
<style scoped>
iframe {
  border: none;
  width: 45%;
  height: 400px;
}
</style>
