<template>
  <div>
    <div class="list" @scroll="scrollHandler" ref="list">
      <div class="top" :style="{height: topHeight + 'px'}"></div>
      <div class="item" v-for="item in realDataList" :key="item">
        {{ item }}
      </div>
      <div class="bottom" :style="{height: bottomHeight + 'px'}"></div>
    </div>
    <el-button type="primary" @click="addData">添加数据</el-button>
  </div>
</template>

<script setup>
const dataList = []
const addData = () => {
  const startIndex = dataList.length
  for (let i = startIndex + 1; i <= startIndex + 300; i++) {
    dataList.push(i)
  }
  scrollHandler()
}

onMounted(addData)

const list = ref(null)
const reserveCount = 8
const itemHeight = 40
const topHeight = ref(0)
const bottomHeight = ref(0)
const realDataList = ref([])

const scrollHandler = () => {
  const totalHeight = dataList.length * itemHeight
  const {clientHeight, scrollTop} = list.value
  if (totalHeight < clientHeight) {
    realDataList.value = dataList
    return
  }
  const reserveHeight = reserveCount * itemHeight
  const startIndex = Math.floor(Math.max(scrollTop - reserveHeight, 0) / itemHeight)
  const endIndex = startIndex + reserveCount * 2 + Math.ceil(clientHeight / itemHeight)
  realDataList.value = dataList.slice(startIndex, endIndex)
  topHeight.value = startIndex * itemHeight
  bottomHeight.value = (dataList.length - realDataList.value.length) * itemHeight - topHeight.value
}
</script>
<style lang="less" scoped>
.list {
  width: 400px;
  height: 600px;
  border: 1px solid gray;
  overflow-y: auto;
  .item {
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid gray;
  }
}
.el-button {
  margin-top: 24px;
}
</style>
