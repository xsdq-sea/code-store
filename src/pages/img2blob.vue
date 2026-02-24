<template>
  <div>
    <img src="@/assets/logo.png" class="logo" />
    <br />
    <el-button type="primary" @click="toBase64">转base64</el-button>
    <el-button type="primary" :disabled="!hasToBase64" @click="toBlob">base64转blob</el-button>
  </div>
</template>
<script setup lang="ts">
const base64 = ref('')
const hasToBase64 = ref(false)
// 图片转base64
const toBase64 = () => {
  const img: HTMLImageElement = document.querySelector('.logo')!
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, img.width, img.height)
  base64.value = canvas.toDataURL()
  console.log(base64.value)
  // canvas.toBlob(blob => console.log(blob)) 直接转blob
  hasToBase64.value = true
}
// base64 转 blob(file)
const toBlob = () => {
  const arr = base64.value.split(';base64,')
  const type = arr[0].split(':')[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const blob = new Blob([u8arr], {type})
  // 转file，其实file就是继承自blob，只是多了几个字段而已，比如lastModified、name
  // const file = new File([blob], 'image.png', {type: 'image/png'})
  console.log(blob)
}
</script>
<style lang="less" scoped>
img {
  vertical-align: middle;
}
.el-button {
  margin-top: 20px;
}
p {
  margin: 0;
  padding-right: 8px;
  font-size: 12px;
  max-height: 500px;
  word-break: break-all;
  overflow-y: auto;
}
</style>
