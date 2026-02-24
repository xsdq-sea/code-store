const WebSocket = require('ws')

const wss = new WebSocket.Server({port: 8081})

wss.on('connection', ws => {
  console.log('客户端已连接')

  ws.send(JSON.stringify({type: 'data', content: '欢迎连接 WebSocket!'}))

  ws.on('message', message => {
    const data = message.toString()
    const obj = JSON.parse(data)
    if (obj.type === 'heart') {
      console.log('收到心跳')
      ws.send(JSON.stringify({type: 'heart'}))
    } else if (obj.type === 'data') {
      console.log('收到客户端消息', obj.content)
    } else if (obj.type === 'notice') {
      console.log('收到广播通知', obj.content)
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({type: 'notice', content: obj.content}))
        }
      })
    }
  })

  ws.on('close', () => {
    console.log('客户端断开连接')
  })

  ws.on('error', () => {
    console.error('WebSocket 报错', err)
  })
})

console.log('ws已启动')
