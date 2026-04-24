<template>
  <div>
    <color-picker v-model="color"></color-picker>
    <el-button @click="changeLocale">切换语言</el-button>
    {{ $t('msg') }}
  </div>
</template>

<script setup>
const color = ref('#f44336')
const {t, locale} = useI18n()
console.log(t('msg'))

const changeLocale = () => {
  locale.value = 'en'
  console.log(t('msg'))
}
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
