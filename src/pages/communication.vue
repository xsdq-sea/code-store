<template>
  <div>
    <p>
      <el-input v-model.trim="content" placeholder="输入广播内容"></el-input>
      <el-button @click="broadcast">广播</el-button>
    </p>
    <p>
      <el-input v-model.trim="content2" placeholder=""></el-input>
      <el-button @click="sharedWorker">shareWorker</el-button>
    </p>
  </div>
</template>
<script setup lang="ts">
/******************** 广播 ********************/
const channel = new BroadcastChannel('myChannel')
channel.onmessage = event => {
  console.log(`收到广播消息："${event.data}"`)
}

const content = ref('')

const broadcast = () => {
  if (!content.value) return
  channel.postMessage(content.value)
  content.value = ''
}
/******************** 广播 ********************/

/******************** shareWorker ********************/
const worker = new SharedWorker('/sharedWorker.js?v=1')

worker.port.postMessage({type: 'id', value: 'communication'})

// 监听sharedWorker发送的消息
worker.port.onmessage = event => {
  console.log('收到消息:' + event.data)
}

// 使用 addEventListener 就必须调用 start 方法
// worker.port.start()
// worker.port.addEventListener('message', event => {
//   console.log('收到sharedWorker发送的消息:' + event.data)
// })

const content2 = ref('')
// 向sharedWorker发送消息
const sharedWorker = () => {
  if (!content2.value) return
  worker.port.postMessage(content2.value)
  content2.value = ''
}

onBeforeUnmount(() => {
  worker.port.postMessage({type: 'remove'})
})
/******************** shareWorker ********************/
</script>

<style>
.el-input {
  width: 240px;
  margin-right: 16px;
}
</style>
