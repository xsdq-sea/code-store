<template>
  <div class="container">
    <div class="move-zoom-box">
      <div class="header">拖拽移动，四周缩放</div>
    </div>
  </div>
</template>
<script setup>
onMounted(() => {
  const box = document.querySelector('.move-zoom-box')
  const parent = box.parentNode
  box.style.left = (parent.clientWidth - box.offsetWidth) / 2 + 'px'
  box.style.top = Math.max((parent.clientHeight - box.offsetHeight) / 2, 0) + 'px'

  const header = box.getElementsByClassName('header')[0]
  header.style.cursor = 'move'

  const style = window.getComputedStyle(box)
  header.onmousedown = e => {
    let originX = e.clientX
    let originY = e.clientY
    let left = parseFloat(style.left)
    let top = parseFloat(style.top)

    document.onselectstart = () => false
    document.onmousemove = e => {
      let offsetX = e.clientX - originX
      let offsetY = e.clientY - originY
      let newLeft = Math.min(Math.max(left + offsetX, -box.offsetWidth + 40), parent.clientWidth - 40)
      let newTop = Math.min(Math.max(top + offsetY, 0), parent.clientHeight - 40)
      box.style.left = newLeft + 'px'
      box.style.top = newTop + 'px'
    }
    document.onmouseup = function () {
      document.onselectstart = null
      document.onmousemove = null
      document.onmouseup = null
    }
  }

  function resizeMousedown(type, e) {
    let originX = e.clientX
    let originY = e.clientY
    let originHeight = box.offsetHeight
    let originWidth = box.offsetWidth
    let originLeft = parseFloat(style.left)
    let originTop = parseFloat(style.top)

    document.onselectstart = () => false
    document.onmousemove = e => {
      let offsetX = e.clientX - originX
      let offsetY = e.clientY - originY
      if ([2, 3, 4].includes(type)) box.style.width = originWidth + offsetX + 'px'
      if ([4, 5, 6].includes(type)) box.style.height = originHeight + offsetY + 'px'
      if ([0, 6, 7].includes(type)) {
        box.style.width = originWidth - offsetX + 'px'
        box.style.left = originLeft + offsetX + 'px'
      }
      if ([0, 1, 2].includes(type)) {
        if (originTop + offsetY < 0) offsetY = -originTop
        box.style.height = originHeight - offsetY + 'px'
        box.style.top = originTop + offsetY + 'px'
      }
    }
    document.onmouseup = function () {
      document.onselectstart = null
      document.onmousemove = null
      document.onmouseup = null
    }
  }

  const createDiv = (type, styles = {}) => {
    let div = document.createElement('div')
    div.style.cssText = 'position:absolute;z-index:1'
    Object.keys(styles).forEach(key => (div.style[key] = styles[key]))
    div.onmousedown = resizeMousedown.bind(null, type)
    box.appendChild(div)
  }

  // 左上角
  createDiv(0, {cursor: 'nw-resize', top: 0, left: 0, width: '10px', height: '10px'})
  // 上
  createDiv(1, {cursor: 'n-resize', top: 0, left: '10px', right: '10px', height: '5px'})
  // 右上角
  createDiv(2, {cursor: 'ne-resize', top: 0, right: 0, width: '10px', height: '10px'})
  // 右
  createDiv(3, {cursor: 'e-resize', top: '10px', right: 0, bottom: '10px', width: '5px'})
  // 右下角
  createDiv(4, {cursor: 'se-resize', bottom: 0, right: 0, width: '10px', height: '10px'})
  // 下
  createDiv(5, {cursor: 's-resize', bottom: 0, left: '10px', right: '10px', height: '5px'})
  // 左下角
  createDiv(6, {cursor: 'sw-resize', bottom: 0, left: 0, width: '10px', height: '10px'})
  // 左
  createDiv(7, {cursor: 'w-resize', top: '10px', left: 0, bottom: '10px', width: '5px'})
})
</script>
<style lang="less" scoped>
.container {
  height: calc(100vh - 48px);
  position: relative;
  width: 100%;
  border: 1px solid gray;
  overflow: hidden;
  .move-zoom-box {
    position: absolute;
    width: 500px;
    height: 500px;
    box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    max-height: 100%;
    .header {
      height: 50px;
      border-bottom: 1px solid rgb(231, 231, 231);
      padding-left: 16px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
