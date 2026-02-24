<template>
  <el-scrollbar class="list" ref="scrollBar" height="500px" @scroll="scrollHanlder">
    <div class="loading" ref="load" v-show="loading">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
    <div v-for="item in dataList" class="item" :key="item">{{ item }}</div>
  </el-scrollbar>
</template>
<script setup lang="ts">
import {ElScrollbar} from 'element-plus'

const dataList = ref<number[]>([])
for (let i = 161; i <= 200; i++) {
  dataList.value.push(i)
}

const scrollBar = ref<InstanceType<typeof ElScrollbar> | null>(null)
const wrap = ref<HTMLElement | null>(null)
onMounted(() => {
  const wrapEl: HTMLElement = document.querySelector('.list .el-scrollbar__wrap')!
  const scrollTop = wrapEl.scrollHeight - wrapEl.clientHeight
  scrollBar.value!.setScrollTop(scrollTop)
  wrap.value = wrapEl
})

const loading = ref(false)
const scrollHanlder = () => {
  if (wrap.value!.scrollTop < 100 && !loading.value) {
    loading.value = true
    const start = dataList.value[0] - 1
    const scrollHeight = wrap.value!.scrollHeight
    setTimeout(async () => {
      loading.value = false
      for (let i = start; i > start - 20; i--) {
        dataList.value.unshift(i)
      }
      await nextTick()
      scrollBar.value?.setScrollTop(wrap.value!.scrollHeight - scrollHeight - 40)
    }, 1500)
  }
}
</script>
<style lang="less" scoped>
.list {
  width: 300px;
  border: 1px solid #ccc;
  height: auto;
  .item {
    line-height: 40px;
    padding-left: 16px;
    &:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }
  }
  .loading {
    width: 100%;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
  }
}
</style>
