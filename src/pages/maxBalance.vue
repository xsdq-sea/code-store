<template>
  <div class="left">
    <div>设置数组元素个数</div>
    <el-input-number v-model="count" step-strictly :min="2" :max="10"></el-input-number>
    <el-button style="margin-left: 8px" @click="createArray">生成数组</el-button>
    <div>{{ numbers }}</div>
    <el-button @click="result = getPercentValue(numbers) || []">计算</el-button>
    <div>{{ result }}</div>
  </div>
</template>
<script setup lang="ts">
const count = ref(3)
const numbers = ref<number[]>([])
const createArray = () => {
  const numList: number[] = []
  while (numList.length < count.value) {
    const num = Math.floor(Math.random() * 999) + 1
    if (!numList.includes(num)) numList.push(num)
  }
  numbers.value = numList.sort((a, b) => a - b)
}

const result = ref<string[]>([])
const getPercentValue = (array: Array<number>, precision = 2) => {
  // 如果不是数字则赋值为0
  let arrayList = array.map(value => (isNaN(value) ? 0 : value))
  // 计算总和
  let sum = arrayList.reduce((total, value) => total + value)
  // 0不能做除数，直接返回
  if (sum === 0) return
  // 小数位扩大倍数
  let digits = Math.pow(10, precision)
  // 总份额
  let total = digits * 100
  // 分配份额
  let shareList = arrayList.map(val => (val / sum) * total)
  // 取整数部分
  let integerList = shareList.map(val => Math.trunc(val))
  // 计算整数部分的总和
  let shareSum = integerList.reduce((total, val) => total + val)
  // 取小数部分
  let decimalsList = shareList.map((value, index) => value - integerList[index])
  // 整数部分总和小于总份额时
  while (shareSum < total) {
    let max = decimalsList[0]
    let maxIndex = 0
    // 找出小数位最大的下标
    for (let i = 1; i < decimalsList.length; i++) {
      if (decimalsList[i] > max) {
        max = decimalsList[i]
        maxIndex = i
      }
    }
    // 小数位最大的加1
    integerList[maxIndex] += 1
    // 加1后小数清零，不参与下次比较
    decimalsList[maxIndex] = 0
    // 总数也需要加1
    shareSum += 1
  }
  // 返回每项占比
  return integerList.map(value => (value / digits).toFixed(precision) + '%')
}
</script>
<style lang="less" scoped>
div {
  flex: 1;
}
</style>
