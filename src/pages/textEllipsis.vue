<template>
  <div class="left">
    <el-input
      type="textarea"
      resize="none"
      placeholder="请输入内容"
      :rows="8"
      v-model="inputTxt"
      @input="change"
    ></el-input>
    <div>
      最多显示
      <el-input-number v-model="rows" :min="1" :precision="0" @change="change"></el-input-number>
      行
    </div>
    <div style="margin-top: 8px">
      省略位置
      <el-select v-model="position" @change="change">
        <el-option label="开始" value="start"></el-option>
        <el-option label="中间" value="middle"></el-option>
        <el-option label="结束" value="end"></el-option>
      </el-select>
    </div>
  </div>
  <div ref="content" class="text">
    {{ res }}
    <span v-if="showAction" @click="expand = !expand">{{ expand ? '收起' : '展开' }}</span>
  </div>
</template>
<script setup lang="ts">
const inputTxt = ref('')
const rows = ref(3)
const position = ref<'start' | 'middle' | 'end'>('end')
const content = ref()

const res = computed(() => {
  if (expand.value) return inputTxt.value
  return result.value
})

const showAction = ref(false)
const expand = ref(false)
const result = ref('')

const change = () => {
  const obj = getEllipsisObj(content.value, inputTxt.value, rows.value, '展开', position.value)
  showAction.value = obj.overflow
  result.value = obj.text
}

const getEllipsisObj = (
  el: HTMLElement,
  text: string,
  rows = 3,
  expandText = '展开',
  position: 'start' | 'middle' | 'end' = 'end'
) => {
  const px2num = (value: string) => parseFloat(value) || 0

  const getEllipsisText = (el: HTMLElement, maxH: number): string => {
    let tempText = position === 'end' ? text : [...text].reverse().join('')
    let l = 0
    let r = tempText.length
    let res = 0

    while (r - l > 1) {
      const mid = Math.floor((l + r) / 2)
      el.innerText = `...${tempText.slice(0, mid)} ${expandText}`
      if (position === 'end') el.innerText = `${tempText.slice(0, mid)}... ${expandText}`
      if (el.offsetHeight <= maxH) {
        l = mid
        res = mid
      } else r = mid
    }
    if (position === 'end') return text.slice(0, res) + '...'
    return '...' + text.slice(tempText.length - res, tempText.length)
  }

  const getMiddleEllipsisText = (el: HTMLElement, maxH: number) => {
    const middle = Math.floor((0 + text.length) / 2)
    let l = [0, middle]
    let r = [middle, text.length]
    while (l[1] - l[0] > 1 || r[1] - r[0] > 1) {
      const lm = Math.floor((l[0] + l[1]) / 2)
      const rm = Math.ceil((r[0] + r[1]) / 2)
      el.innerText = `${text.slice(0, lm)}......${text.slice(rm, text.length)} ${expandText}`
      if (el.offsetHeight <= maxH) {
        l = [lm, l[1]]
        r = [r[0], rm]
      } else {
        l = [l[0], lm]
        r = [rm, r[1]]
      }
    }
    return `${text.slice(0, l[0])}......${text.slice(r[1], text.length)}`
  }

  const div = document.createElement('div')
  const styles = getComputedStyle(el)
  Array.from(styles).forEach((name: any) => (div.style[name] = styles[name]))
  div.style.position = 'fixed'
  div.style.zIndex = '-99999'
  div.style.top = '-99999px'
  div.style.height = 'auto'
  div.style.maxHeight = 'auto'
  div.style.minHeight = 'auto'
  div.innerText = text
  document.body.appendChild(div)

  const {lineHeight, paddingTop, paddingBottom} = div.style
  const maxHeight = Number(rows) * px2num(lineHeight) + px2num(paddingTop) + px2num(paddingBottom)
  let overflow = false
  if (maxHeight < div.offsetHeight) {
    text = position === 'middle' ? getMiddleEllipsisText(div, maxHeight) : getEllipsisText(div, maxHeight)
    overflow = true
  }
  document.body.removeChild(div)
  return {overflow, text}
}
</script>
<style lang="less" scoped>
.left {
  width: 500px;
  .el-input-number {
    margin-top: 8px;
  }
}
.text {
  margin-left: 16px;
  padding: 0 8px;
  width: 500px;
  min-height: 40px;
  background-color: rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  word-break: break-word;
  span {
    color: #006482;
    cursor: pointer;
  }
}
</style>
