<template>
  <div>
    <el-input v-model="number" placeholder="输入数字" @input="input"></el-input>
    <br />
    <span>结果：{{ result }}</span>
  </div>
</template>
<script setup lang="ts">
const number = ref('0')
const result = computed(() => {
  let n = Number(number.value)
  if (!n && n !== 0) return
  let num = n.toString()
  let sign = num.indexOf('-') > -1 ? '-' : ''
  num = num.indexOf('-') > -1 ? num.substr(1) : num
  let cents = num.indexOf('.') > 0 ? num.substr(num.indexOf('.')) : ''
  cents = cents.length > 1 ? cents : ''
  num = num.indexOf('.') > 0 ? num.substring(0, num.indexOf('.')) : num
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
  }
  return sign + num + cents
})

const input = () => {
  number.value = number.value.replace(/[^0-9.-]|(?<=.)-|((^|(?<=-))0(?=\d))|(?<=\..*)\./g, '')
}
</script>
<style lang="less" scoped>
.el-input {
  width: 200px;
  margin-bottom: 24px;
}
</style>
