<template>
  <div class="list">
    <div class="item" v-for="item in dataList" :key="item">
      <span class="label">{{ item }}</span>
      <el-button type="primary">按钮1</el-button>
      <el-button type="primary">按钮2</el-button>
    </div>
  </div>
</template>

<script setup>
import Sortable from 'sortablejs'

const dataList = reactive([])

for (let i = 0; i < 20; i++) {
  dataList.push(i)
}

onMounted(() => {
  const el = document.querySelector('.list')
  new Sortable(el, {
    onEnd: ({newIndex, oldIndex}) => {
      console.log(oldIndex, newIndex)

      const item = dataList[oldIndex]
      dataList.splice(oldIndex, 1)
      dataList.splice(newIndex, 0, item)
      console.log(dataList)
    }
  })
})
</script>
<style lang="less" scoped>
.list {
  width: 100%;
  border: 1px solid gray;
  height: 60vh;
  overflow-y: auto;
  .item {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    .label {
      margin-right: auto;
    }
    & + .item {
      border-top: 1px solid red;
    }
  }
}
</style>
