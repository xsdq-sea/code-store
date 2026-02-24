<template>
  <div>
    <div>
      <!-- 方式一 -->
      <el-button v-if="showAdd" @click="event.prompt()">添加到桌面</el-button>
      <!-- 方式二 -->
      <el-button v-if="showAdd" @click="prompt">添加到桌面</el-button>
    </div>

    <div style="margin-top: 16px; display: flex; gap: 16px">
      <el-input v-model.trim="content"></el-input>
      <el-button @click="notify">测试通知</el-button>
    </div>
    <div style="margin-top: 16px">
      <el-button @click="getData">请求API</el-button>
      <el-button @click="submit">离线请求</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js?v=3')
    .then(res => console.log('注册成功', res))
    .catch(err => console.log('注册失败', err))
}

/************************ 添加到桌面 start *************************/
const showAdd = ref(false)
const event = ref<any>(null)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: any) => {
    showAdd.value = true
    event.value = e

    // 方式一
    e.userChoice.then((res: any) => {
      console.log(res)
      if (res.outcome === 'accepted') showAdd.value = false
    })
  })
})

// 方式二
const prompt = () => {
  event.value!.prompt().then((res: any) => {
    console.log(res)
    if (res.outcome === 'accepted') showAdd.value = false
  })
}

/************************ 添加到桌面 end *************************/
// 右下角通知
const content = ref('')
const notify = async () => {
  if (!content.value) return
  if (Notification.permission !== 'granted') {
    await Notification.requestPermission()
  }
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg!.showNotification('Hello!', {
        body: content.value,
        icon: '/icon.png'
      })
    })
  }
}

// 请求拦截，mock数据
const getData = async () => {
  const res = await fetch('/api/test')
  const data = await res.json()
  console.log('API 返回：' + JSON.stringify(data))
}

// 离线时缓存请求，有网时重新发送
const submit = async () => {
  const requestData = {
    url: '/api/submit',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    data: {name: '张三', age: 20}
  }
  const {url, method, headers, data} = requestData
  await fetch(url, {
    method,
    headers,
    body: JSON.stringify(data)
  })
    .then(async res => {
      const result = await res.json()
      console.log(result)
    })
    .catch(async () => {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const reg = await navigator.serviceWorker.ready
        navigator.serviceWorker.controller?.postMessage({type: 'ADD_QUEUE', payload: requestData})
        await reg.sync.register('sync-requests')
      }
    })
}
</script>
