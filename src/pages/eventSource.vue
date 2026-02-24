<template>
  <div>
    <el-input v-model="url"></el-input>
    <el-button type="primary" @click="connect">连接</el-button>
    <el-button type="primary" @click="close">断开</el-button>
    <ul class="list" ref="list">
      <li v-for="(item, index) in dataList" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>
<script setup>
import {useTemplateRef} from 'vue'

const url = ref('http://localhost:3010/sse')
const dataList = reactive([])
const list = useTemplateRef('list')
let eventSource = null

const connect = () => {
  eventSource = new EventSource(url.value)

  eventSource.onopen = () => {
    console.log('open')
  }

  // 监听默认事件
  // eventSource.addEventListener('message', addMessage)
  eventSource.onmessage = addMessage

  // 监听自定义事件(名称由服务端定义)
  eventSource.addEventListener('clientCount', addMessage)

  eventSource.onerror = () => {
    console.log('出错了')
    /* 
   eventSource 断开后会自动重连
   调用close方法关闭，不会自动重连
  */
  }
}

const addMessage = event => {
  console.log(event.data)
  dataList.push(event.data)
  nextTick(() => {
    list.value.scrollTop = list.value.scrollHeight
  })
}

const close = () => eventSource.close()
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
  margin-right: 16px;
}
.list {
  margin-top: 24px;
  max-height: 600px;
  overflow-y: auto;
  li {
    line-height: 24px;
    font-size: 14px;
  }
}
</style>
