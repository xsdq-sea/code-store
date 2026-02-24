let ports = []
self.onconnect = function (event) {
  console.log('连接成功')

  // event.ports[0] === event.source
  const port = event.ports[0]

  if (!ports.includes(port)) ports.push(port)

  // 监听主线程发送的消息
  port.onmessage = function (event) {
    const message = event.data
    console.log('收到主线程消息:', message)
    if (message.type === 'id') port.id = message.value
    else if (message.type === 'remove') {
      const index = ports.findIndex(item => item.id === event.target.id)
      if (index !== -1) ports.splice(index, 1)
    } else {
      // 向所有标签页主线程发送消息
      ports.forEach(port => {
        console.log(port)
        if (port.id !== event.target.id) port.postMessage(event.data)
      })
    }
  }

  port.postMessage('sharedWorker 已连接')
}
