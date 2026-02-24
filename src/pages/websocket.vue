<template>
  <div>
    <div>
      <el-input v-model.trim="url" placeholder="socket地址"></el-input>
      <el-button type="primary" @click="connect">连接</el-button>
      <el-button type="primary" @click="close">断开</el-button>
    </div>
    <div style="margin-top: 16px">
      <el-input v-model.trim="content"></el-input>
      <el-button type="primary" @click="send('data')">发送</el-button>
      <el-button type="primary" @click="send('notice')">广播</el-button>
    </div>
    <div style="margin-top: 16px; line-height: 1.5" v-html="log"></div>
  </div>
</template>
<script setup lang="ts">
import Toast from '@/components/toast'

let interval: number
let socketTime: number = 0
const heartCheck = () => {
  interval = setInterval(() => {
    ws!.send(JSON.stringify({type: 'heart'}))
    let diff = +new Date() - socketTime
    if (diff > 15000) window.ws!.close()
  }, 10000)
}

const log = ref('')
let ws: WebSocket | null = null
const createWebSocket = (url: string) => {
  ws = new WebSocket(url)
  ws.onopen = () => {
    console.log('open')
    log.value += `open --- ${new Date().toLocaleString()}<br/>`
    socketTime = +new Date()
    heartCheck()
  }
  ws.onmessage = event => {
    socketTime = +new Date()
    let data = JSON.parse(event.data)
    if (data.type === 'heart') {
      console.log('收到心跳')
      log.value += `heart --- ${new Date().toLocaleString()}<br/>`
    } else if (data.type === 'data') {
      console.log(data.content)
      log.value += `content --- ${data.content}<br/>`
    } else if (data.type === 'notice') {
      log.value += `notice --- ${data.content}<br/>`
    }
  }
  ws.onerror = () => {
    console.log('error')
    log.value += `error --- ${new Date().toLocaleString()}<br/>`
    reconnect(url)
  }
  ws.onclose = () => {
    console.log('close')
    log.value += `close --- ${new Date().toLocaleString()}<br/>`
    reconnect(url)
  }
}

let lockReconnect = false
let manual = false
const reconnect = (url: string) => {
  if (lockReconnect || manual) return
  clearInterval(interval)
  lockReconnect = true
  setTimeout(() => {
    createWebSocket(url)
    lockReconnect = false
  }, 5000)
}

const url = ref('ws://localhost:8081')
const connect = () => {
  if (!url.value) return Toast('请输入 WebSocket 地址!')
  if ('WebSocket' in window) {
    createWebSocket(url.value)
  }
}

const close = () => ws?.close()

const content = ref('')
const send = (type: string) => {
  if (!content.value) return Toast('请输入内容!')
  if (!ws || ws.readyState !== WebSocket.OPEN) return Toast('请先连接WebSocket!')
  ws?.send(JSON.stringify({type, content: content.value}))
  content.value = ''
}

onBeforeUnmount(() => {
  window.ws?.close()
  manual = true
})
</script>
<style lang="less" scoped>
.el-input {
  width: 500px;
  margin-right: 16px;
}
</style>
