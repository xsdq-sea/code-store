<template>
  <div class="copy">
    <p>{{ str }}</p>
    <el-button @click="copy">复制</el-button>
    <input ref="input" />
  </div>
</template>
<script setup lang="ts">
const str = ref('我是一段文字，快来复制我')
const input = ref<HTMLInputElement | null>(null)
const copy = () => {
  input.value!.value = str.value
  if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    window.getSelection()!.removeAllRanges()
    let range = document.createRange()
    range.selectNode(input.value as Node)
    window.getSelection()!.addRange(range)
    document.execCommand('copy')
  } else {
    input.value!.select()
    document.execCommand('copy')
  }
}
</script>
<style lang="less" scoped>
input {
  opacity: 0;
}
</style>
