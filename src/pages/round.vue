<template>
  <div class="round">
    <p class="">
      <span>保留小数位</span>
      <el-input-number v-model="place" :min="0" :max="10" />
    </p>
    <p>
      <span>输入小数</span>
      <el-input v-model="decimal"></el-input>
    </p>
    <p>
      <span>结果</span>
      {{ toFixed(decimal, place) }}
    </p>
  </div>
</template>
<script setup lang="ts">
const place = ref(0)
const decimal = ref(0)

const toFixed = (num: number, n = 0) => {
  let unit = num < 0 ? '-' : ''
  let str = Math.abs(num).toString()
  let index = str.indexOf('.')
  let integer = index === -1 ? str : str.substring(0, index)
  let decimal = index === -1 ? '' : str.substring(index + 1)
  decimal = decimal.padEnd(n, '0')
  let nextNum: string | number = 0
  if (decimal.length > n) {
    nextNum = decimal.substr(n, 1)
    decimal = decimal.substr(0, n)
  }
  let number = Number(`${integer}.${decimal}`)
  if (Number(nextNum) >= 5) number += Math.pow(10, -n)
  return unit + number.toFixed(n)
}
</script>
<style lang="less" scoped>
.round {
  p {
    display: flex;
    align-items: center;
  }
  span {
    display: inline-block;
    width: 90px;
  }
  .el-input {
    width: 220px;
  }
}
</style>
