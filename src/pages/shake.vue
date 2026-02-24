<template>
  <el-button type="primary" @click="shake(print, 300, '防抖点击')">防抖</el-button>
  <el-button type="primary" @click="throttle(print, 1000, '节流点击')">节流</el-button>
</template>
<script setup lang="ts">
interface ExtendFunc extends Function {
  timer?: number
  lastTime?: number
}

const shake = (fn: ExtendFunc, delay: number, ...args: any[]) => {
  if (fn.timer) clearTimeout(fn.timer)
  fn.timer = setTimeout(() => {
    fn(...args)
  }, delay)
}
const throttle = (fn: ExtendFunc, delay: number, ...args: any[]) => {
  let now = +new Date()
  if (fn.timer) clearTimeout(fn.timer)
  if (!fn.lastTime || now > fn.lastTime + delay) {
    // 第一次点击或超过间隔时间
    fn.lastTime = now // 记录点击的时间
    fn(...args)
  } else {
    // 两次间隔时间不够，则定时延迟执行
    fn.timer = setTimeout(() => {
      fn(...args)
      fn.lastTime = +new Date() // 执行后重置时间
    }, delay + fn.lastTime - now)
  }
}
const print = (str: string) => console.log(str)
</script>
<style lang="less" scoped>
.code {
  margin-left: 0 !important;
  margin-top: 16px;
}
</style>
