<template>
  <el-input v-model="content"></el-input>
  <el-button @click="send">发送</el-button>
</template>
<script setup>
const worker = new SharedWorker('/sharedWorker.js?v=1')
worker.port.postMessage({type: 'id', value: 'sharedWorker'})

worker.port.onmessage = event => {
  console.log('收到消息:' + event.data)
}

const content = ref('')
const send = () => {
  if (!content.value) return
  worker.port.postMessage(content.value)
  content.value = ''
}

onBeforeUnmount(() => {
  worker.port.postMessage({type: 'remove'})
})
</script>
<style lang="less" scoped>
.el-input {
  width: 240px;
  margin-right: 16px;
}
</style>
