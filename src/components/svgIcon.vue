<template>
  <svg class="svg-icon icon-svg" :class="iconClass" aria-hidden="true" @click="$emit('click', $event)">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script setup lang="ts">
defineEmits(['click'])
const props = defineProps<{iconClass: string}>()
const iconName = computed(() => `#${props.iconClass}`)
</script>
<style lang="less" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  font-size: 24px;
  fill: currentColor;
  overflow: hidden;
  outline: none;
}
</style>
