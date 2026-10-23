const BASE_URL = new URL('./', self.location.href)
const CACHE_PREFIX = `code-store-${BASE_URL.pathname}-`
const CACHE_NAME = `${CACHE_PREFIX}v2`
const OFFLINE_URL = new URL('offline.html', BASE_URL).href

// 安装阶段：缓存必要文件
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([OFFLINE_URL])))
  self.skipWaiting()
})

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key))))
  )
  self.clients.claim()
})

// 拦截请求
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (url.origin !== BASE_URL.origin || !url.pathname.startsWith(BASE_URL.pathname)) return

  // mock API
  if (url.href === new URL('api/test', BASE_URL).href) {
    event.respondWith(
      new Response(JSON.stringify({msg: '来自 Service Worker 的数据'}), {
        headers: {'Content-Type': 'application/json'}
      })
    )
    return
  }

  // 其他请求：先网络，失败则缓存/离线页
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then(resp => resp || caches.match(OFFLINE_URL)))
  )
})

const offlineQueue = []
self.addEventListener('message', event => {
  if (event.data.type === 'ADD_QUEUE') {
    offlineQueue.push(event.data.payload)
    console.log('新增请求', event.data.payload)
  }
})

// 无网络时不会执行，有网络后自动执行
self.addEventListener('sync', event => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(
      (async () => {
        if (!offlineQueue.length) return
        for (let index in offlineQueue) {
          const {url, method, headers, data} = offlineQueue[index]
          await fetch(url, {method, headers, body: JSON.stringify(data)}).then(() => {
            offlineQueue.splice(index, 1)
          })
        }
      })()
    )
  }
})

// 推送通知
// self.addEventListener('push', event => {
//   const data = event.data?.json() || {title: '新消息', body: '你有一条推送'}
//   event.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.body,
//       icon: '/icon.png'
//     })
//   )
// })
