<template>
  <div class="outer" ref="outer">
    <div class="inner" ref="inner">滚动条宽度为：{{ scrollWidth }}</div>
  </div>
</template>
<script setup lang="ts">
const outer = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const scrollWidth = ref(0)

onMounted(() => {
  const innerWidth = inner.value!.offsetWidth
  outer.value!.style.overflowY = 'scroll'
  nextTick(() => {
    scrollWidth.value = innerWidth - inner.value!.offsetWidth
  })
})
</script>
<style lang="less" scoped>
.outer {
  width: 500px;
  height: 400px;
  background-color: black;
  .inner {
    height: 600px;
    background-color: rgba(255, 0, 0, 0.4);
    color: white;
  }
}
</style>
