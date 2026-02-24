<template>
  <el-switch
    v-model="direction"
    active-text="横向"
    inactive-text="竖向"
    :active-value="1"
    :inactive-value="2"
  ></el-switch>
  <div
    ref="moveTools"
    class="move-tools"
    :class="{vertical: direction === 2}"
    :style="{left: left + 'px', top: top + 'px'}"
  >
    <span class="move" @mousedown="mousedown"></span>
    <div class="list">
      <slot>
        <div class="item">按</div>
        <div class="item">住</div>
        <div class="item">红</div>
        <div class="item">色</div>
        <div class="item">部</div>
        <div class="item">分</div>
        <div class="item">拖</div>
        <div class="item">动</div>
      </slot>
    </div>
  </div>
</template>
<script setup>
const {defaultLeft, defaultTop} = defineProps({
  defaultLeft: Number,
  defaultTop: Number
  // direction: {
  //   type: Number,
  //   default: 2 // 1 横向 2 竖向
  // }
})

const direction = ref(1)
const moveTools = ref(null)
const left = ref(240)
const top = ref(100)
const isRtl = ref(false)

watchEffect(() => {
  if (defaultLeft) left.value = defaultLeft
  if (defaultTop) top.value = defaultTop
})

const mousedown = () => {
  window.getSelection().removeAllRanges()
  document.body.style.cursor = 'grab'
  document.onselectstart = () => false
  document.onmousemove = e => {
    let width = moveTools.value.offsetWidth
    let height = moveTools.value.offsetHeight
    let {clientX, clientY} = e
    let number = isRtl.value ? width - 20 : 20
    left.value = Math.min(Math.max(clientX - number, 0), window.innerWidth - width)
    top.value = Math.min(Math.max(clientY - 20, 0), window.innerHeight - height)
    e.preventDefault()
  }
  document.onmouseup = () => {
    document.body.style.cursor = 'auto'
    document.onselectstart = null
    document.onmousemove = null
    document.onmouseup = null
  }
}
</script>
<style lang="less" scoped>
.move-tools {
  position: fixed;
  z-index: 5;
  display: flex;
  gap: 8px;
  align-items: center;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  height: 40px;
  padding: 2px 8px;
  &.vertical {
    padding: 8px 2px;
    flex-direction: column;
    width: 40px;
    height: auto;
    .list {
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 260px;
    }
  }
  .move {
    cursor: grab;
    width: 32px;
    height: 32px;
    background-color: red;
  }
  .list {
    display: flex;
    align-items: center;
    overflow-x: auto;
    max-width: 260px;
    gap: 8px;
    &::-webkit-scrollbar {
      display: none;
    }
    .item {
      line-height: 32px;
      text-align: center;
      width: 32px;
      border: 1px solid red;
      flex-shrink: 0;
    }
  }
}
</style>
