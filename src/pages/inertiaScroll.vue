<template>
  <div class="chart">
    <div class="panel">
      <canvas class="main" ref="mainPanel" @mousedown="mousedownHandler"></canvas>
      <canvas class="price" ref="yPanel"></canvas>
    </div>
    <canvas class="index" ref="xPanel"></canvas>
  </div>
</template>
<script setup lang="ts">
import {useTemplateRef} from 'vue'
import {KineticAnimation, type Coordinate} from '@/utils/kinetic-animation'

function generateClosePrices(count = 5000) {
  const closes = [100]
  let sigma = 0.01
  for (let i = 1; i < count; i++) {
    const z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random())
    sigma = 0.9 * sigma + (1 - 0.9) * 0.01
    const prev = closes[i - 1]
    const next = prev * Math.exp(-0.0002 + sigma * z)
    closes.push(Number(next.toFixed(2)))
  }
  return closes
}

const mainPanel = useTemplateRef<HTMLCanvasElement>('mainPanel')
const xPanel = useTemplateRef<HTMLCanvasElement>('xPanel')
const yPanel = useTemplateRef<HTMLCanvasElement>('yPanel')
const dataList: number[] = generateClosePrices()
let mainCtx: CanvasRenderingContext2D | null = null
let xCtx: CanvasRenderingContext2D | null = null
let yCtx: CanvasRenderingContext2D | null = null
const ratio = devicePixelRatio
let itemWidth = 15 // 每个数据的宽度
const xMargin = 100 // x坐标标签最小间距
const yMargin = 40 // y坐标标签的间距
const padding = {top: 30, bottom: 30} // 图表上下留白
const xOffset = ref(0) // 实时偏移
const xOffset_prev = ref(0) // 上一次移动完毕时的偏移
let kinetic: KineticAnimation | null = null

onMounted(() => {
  initCanvas(mainPanel.value!)
  mainCtx = mainPanel.value!.getContext('2d')

  initCanvas(xPanel.value!)
  xCtx = xPanel.value!.getContext('2d')

  initCanvas(yPanel.value!)
  yCtx = yPanel.value!.getContext('2d')

  draw()
})

const initCanvas = (canvas: HTMLCanvasElement) => {
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
}

const getRange = () => {
  const count = Math.ceil(mainPanel.value!.offsetWidth / itemWidth)
  const start = Math.max(Math.floor(xOffset.value / itemWidth), 0)
  const end = start + count + 1
  return [start, end]
}
const getMaxMin = () => {
  const [start, end] = getRange()
  const valueList = dataList.slice(start, end)
  const max = Math.max(...valueList)
  const min = Math.min(...valueList)
  return {max, min}
}
const getCurrDataList = () => {
  const [start, end] = getRange()
  return dataList.slice(start, end).map((item, index) => ({index: index + start, value: item}))
}
const indexToX = (index: number) => mainPanel.value!.offsetWidth - (index * itemWidth + itemWidth / 2) + xOffset.value
const xToIndex = (x: number) => Math.floor((xPanel.value!.offsetWidth - x + xOffset.value) / itemWidth)
const valueToY = (value: number) => {
  const {max, min} = getMaxMin()
  const height = mainPanel.value!.offsetHeight - padding.top - padding.bottom
  const pricePerH = (max - min) / height
  return padding.top + (max - value) / pricePerH
}
const yToValue = (y: number) => {
  const {max, min} = getMaxMin()
  const height = mainPanel.value!.offsetHeight - padding.top - padding.bottom
  const pricePerH = (max - min) / height
  return max - (y - padding.top) * pricePerH
}
const clearPanel = (ctx: CanvasRenderingContext2D, panel: HTMLCanvasElement) => {
  ctx.clearRect(0, 0, panel.width * ratio, panel.height * ratio)
}
const draw = () => {
  clearPanel(mainCtx!, mainPanel.value!)
  clearPanel(xCtx!, xPanel.value!)
  clearPanel(yCtx!, yPanel.value!)
  mainCtx!.beginPath()
  mainCtx!.strokeStyle = 'blue'
  mainCtx!.lineWidth = 2 * ratio

  getCurrDataList().forEach((item, index) => {
    const x = indexToX(item.index) * ratio
    const y = valueToY(item.value) * ratio
    if (!index) mainCtx!.moveTo(x, y)
    else mainCtx!.lineTo(x, y)
  })

  xCtx!.fillStyle = 'blue'
  xCtx!.font = '24px Arial'
  xCtx!.textBaseline = 'middle'
  xCtx!.textAlign = 'center'

  const marginCount = Math.ceil(xMargin / itemWidth)
  const [start, end] = getRange()
  let index = start - (start % marginCount)
  while (index <= end) {
    const x = indexToX(index) * ratio
    xCtx!.fillText(index.toString(), x, (xPanel.value!.offsetHeight / 2) * ratio)
    index += marginCount
  }

  yCtx!.font = '24px Arial'
  yCtx!.fillStyle = 'blue'
  yCtx!.textAlign = 'center'
  let startY = padding.top
  while (startY <= yPanel.value!.offsetHeight) {
    const value = yToValue(startY)
    yCtx!.fillText(value.toFixed(2), (yPanel.value!.offsetWidth / 2) * ratio, startY * ratio)
    startY += yMargin
  }
  mainCtx!.stroke()
}

const resize = () => {
  initCanvas(mainPanel.value!)
  initCanvas(xPanel.value!)
  initCanvas(yPanel.value!)
  draw()
}
window.addEventListener('resize', resize)

const scale = (event: WheelEvent) => {
  const sign = Math.sign(event.deltaY)
  itemWidth += sign
  itemWidth = Math.max(1, itemWidth)
  draw()
}
window.addEventListener('wheel', scale)

onUnmounted(() => {
  window.removeEventListener('wheel', scale)
  window.removeEventListener('resize', resize)
})

let mousedownX = 0
const mousedownHandler = (event: MouseEvent) => {
  stopKinetic()
  mousedownX = event.clientX
  kinetic = new KineticAnimation(0.3, 5, 0.996, 15)
  kinetic.addPosition(mousedownX as Coordinate, performance.now())
  document.addEventListener('mousemove', mousemoveHandler)
  document.addEventListener(
    'mouseup',
    (event: MouseEvent) => {
      xOffset_prev.value = xOffset.value
      document.removeEventListener('mousemove', mousemoveHandler)
      kinetic!.start(event.clientX as Coordinate, performance.now())
      startKinetic()
    },
    {once: true}
  )
}

const mousemoveHandler = (event: MouseEvent) => {
  const currentX = event.clientX
  kinetic!.addPosition(currentX as Coordinate, performance.now())
  scroll(currentX)
}

const scroll = (currentX: number) => {
  const xDiff = currentX - mousedownX
  xOffset.value = xOffset_prev.value + xDiff
  xOffset.value = Math.max(xOffset.value, -(mainPanel.value!.offsetWidth - itemWidth * 5))
  xOffset.value = Math.min(xOffset.value, (dataList.length - 5) * itemWidth)
  draw()
}

let rafId: number | null = null
const startKinetic = () => {
  if (rafId) return
  const frame = () => {
    const now = performance.now()
    if (kinetic!.finished(now)) {
      return stopKinetic()
    }
    scroll(kinetic!.getPosition(now))
    rafId = requestAnimationFrame(frame)
  }
  rafId = requestAnimationFrame(frame)
}
const stopKinetic = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  xOffset_prev.value = xOffset.value
}
</script>
<style scoped lang="less">
.chart {
  width: 100%;
  border: 1px solid #ccc;
}
.panel {
  width: 100%;
  height: 700px;

  display: flex;
  .main {
    flex: 1;
    height: 100%;
    min-width: 0;
  }
  .price {
    border-left: 1px solid #ccc;
    width: 50px;
    height: 100%;
  }
}
.index {
  border-top: 1px solid #ccc;
  width: 100%;
  height: 30px;
}
</style>
