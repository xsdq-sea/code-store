<template>
  <div>
    <div>
      <p>原字符串</p>
      <el-input type="textarea" ref="area" resize="none" rows="3" v-model="str"></el-input>
    </div>
    <div>
      <p>插入的字符串</p>
      <el-input v-model="insertStr"></el-input>
    </div>
    <el-button @click="insert">插入</el-button>
  </div>
</template>
<script setup lang="ts">
interface Component {
  $el: HTMLElement
}

const str = ref('我是原本的字符串，这里插入（）试试')
const insertStr = ref('')
const area = ref<Component | null>(null)
const insert = () => {
  console.log(area.value)
  const textarea: HTMLTextAreaElement = area.value!.$el.querySelector('textarea')!
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = str.value
  str.value = text.slice(0, start) + insertStr.value + text.slice(end)
  const newStart = start + insertStr.value.length
  insertStr.value = ''
  nextTick(() => {
    textarea.setSelectionRange(newStart, newStart)
  })
}
</script>
<style lang="less" scoped>
p {
  display: flex;
  align-items: center;
  div {
    margin-left: 16px;
  }
}
.el-textarea {
  width: 320px;
}
.el-input {
  width: 300px;
  margin-bottom: 16px;
}
</style>
