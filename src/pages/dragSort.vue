<template>
  <div>
    <ul class="v">
      <el-scrollbar :height="500">
        <li
          v-for="(item, index) in dataList_v"
          :class="{front, target: targetItem === item}"
          :ref="el => (itemList[index] = el as HTMLElement)"
          :key="index"
          :draggable="true"
          @dragstart="dragstart(item)"
          @dragend="dragend(1)"
          @dragover="dragoverV(item, $event)"
        >
          {{ item }}
        </li>
      </el-scrollbar>
    </ul>
    <ul class="h">
      <el-scrollbar :height="40">
        <li
          v-for="(item, index) in dataList_h"
          :class="{front, target: targetItem === item}"
          :ref="el => (itemList[index] = el as HTMLElement)"
          :key="index"
          :draggable="true"
          @dragstart="dragstart(item)"
          @dragend="dragend(2)"
          @dragover="dragoverH(item, $event)"
        >
          <span>{{ item }}</span>
        </li>
      </el-scrollbar>
    </ul>
  </div>
</template>
<script setup lang="ts">
const dataList_v = ref<string[]>([])
for (let i = 1; i <= 25; i++) {
  dataList_v.value.push('v_' + i)
}

const dataList_h = ref<string[]>([])
for (let i = 1; i <= 15; i++) {
  dataList_h.value.push('h_' + i)
}

const sourceItem = ref<string | null>(null)
const targetItem = ref<string | null>(null)
const itemList = ref<HTMLElement[]>([])
const front = ref<Boolean>(false)

const dragstart = (item: string): void => {
  sourceItem.value = item
}
const dragend = (type: number) => {
  if (!targetItem.value) return
  let dataList = type === 1 ? dataList_v : dataList_h
  let sourceIndex = dataList.value.indexOf(sourceItem.value!)
  dataList.value.splice(sourceIndex, 1)
  let targetIndex = dataList.value.indexOf(targetItem.value)
  if (!front.value) targetIndex++
  dataList.value.splice(targetIndex, 0, sourceItem.value!)
  targetItem.value = null
}
const dragoverV = (item: string, {target, offsetY}: {target: HTMLElement; offsetY: number}): void => {
  if (item === sourceItem.value) return
  targetItem.value = item
  for (let el of itemList.value) {
    if (el === target || el.contains(target)) {
      el.scrollIntoView({behavior: 'smooth', block: 'nearest'})
      let targetHeight = el.offsetHeight
      if (el !== target) offsetY += target.getBoundingClientRect().top - el.getBoundingClientRect().top
      front.value = offsetY < targetHeight / 2
      break
    }
  }
}

const dragoverH = (item: string, {target, offsetX}: {target: HTMLElement; offsetX: number}): void => {
  if (item === sourceItem.value) return
  targetItem.value = item
  for (let el of itemList.value) {
    if (el === target || el.contains(target)) {
      el.scrollIntoView({behavior: 'smooth', inline: 'nearest'})
      let targetWidth = el.offsetWidth
      if (el !== target) offsetX += target.getBoundingClientRect().left - el.getBoundingClientRect().left
      front.value = offsetX < targetWidth / 2
      break
    }
  }
}
</script>
<style lang="less" scoped>
ul.v {
  border: 1px solid #ccc;
  padding: 0;
  margin: 0;
  width: 400px;
  li {
    line-height: 40px;
    text-align: center;
    &:nth-child(2n) {
      background-color: rgba(0, 0, 0, 0.3);
    }
    &.target {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 2px;
        background: #409eff;
      }
      &.front::after {
        top: -1px;
        bottom: auto;
      }
    }
  }
}
ul.h {
  border: 1px solid #ccc;
  padding: 0;
  margin: 40px 0 0;
  width: 800px;
  :deep(.el-scrollbar__view) {
    display: flex;
    align-items: center;
  }
  li {
    display: inline-block;
    line-height: 40px;
    width: 80px;
    flex-shrink: 0;
    text-align: center;
    border-left: 1px solid #f3f3f3;
    border-right: 1px solid #f3f3f3;
    &.target {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: -1px;
        width: 2px;
        background: #409eff;
      }
      &.front::after {
        left: -1px;
        right: auto;
      }
    }
  }
}
</style>
