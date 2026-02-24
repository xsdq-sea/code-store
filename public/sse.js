const http = require('http')

const clients = []
const server = http.createServer((req, res) => {
  if (req.url === '/sse') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    })

    clients.push(res)

    res.write('data: 服务器欢迎您!\n\n')

    let count = 0
    const interval = setInterval(() => {
      count++
      // 两个\n 表示消息结束，否则客户端监听不到
      res.write(`data: 当前计数: ${count}\n\n`)
      // 自定义事件名，用\n分隔
      res.write(`event: clientCount\ndata: 目前有${clients.length}个客户端连接\n\n`)
    }, 3000)

    req.on('close', () => {
      clearInterval(interval)
      const index = clients.indexOf(res)
      if (index !== -1) clients.splice(index, 1)
    })
  }
})

server.listen(3010, () => {
  console.log('启动成功')
})
