<template>
  <div class="input-auto-size">
    <div class="input">
      <textarea ref="textarea" v-model="value" @input="input" />
    </div>
    <div ref="copy" class="copy">{{ value }}</div>
  </div>
</template>
<script setup lang="ts">
const value = ref('')
const textarea = ref<HTMLElement>()
const copy = ref<HTMLElement>()
const input = () => {
  textarea.value!.style.height = copy.value!.offsetHeight + 'px'
}
</script>
<style lang="less" scoped>
.input {
  padding: 8px;
  background-color: #f6f7f9;
  line-height: 0;
  textarea {
    width: 400px;
    resize: none;
    background-color: transparent;
    border: none;
    outline: none;
    line-height: 18px;
    font-size: 14px;
    padding: 0;
    height: 18px;
    min-height: 18px;
    max-height: 72px;
  }
}

.copy {
  margin-top: 4px;
  width: 400px;
  background-color: #f6f7f9;
  line-height: 18px;
  font-size: 14px;
  padding: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
