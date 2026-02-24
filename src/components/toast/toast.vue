<template>
  <transition name="toast-fade">
    <div v-show="show" class="toast">{{ message }}</div>
  </transition>
</template>
<script setup lang="ts">
const message = ref('')
const show = ref(false)
let timeout: number
const showMessage = (msg: string, duration: number) => {
  clearTimeout(timeout)
  message.value = msg
  show.value = true
  timeout = setTimeout(() => {
    show.value = false
  }, duration)
}
defineExpose({showMessage})
</script>
<style lang="less" scoped>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 24px;
  border-radius: 8px;
  background-color: #000000;
  color: #fff;
  z-index: 9999;
  word-break: break-word;
  font-size: 16px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.5s;
}

.toast-fade-enter,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
