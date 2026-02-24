<template>
  <div>
    <img :src="imgUrl" />
    <br />
    <el-button type="primary" @click="add">添加水印</el-button>
    <br />
    <img :src="markImg" />
  </div>
</template>
<script setup lang="ts">
const imgUrl = new URL('../assets/forexway.png', import.meta.url).href
const markImg = ref('')
const add = () => {
  addWatermark(imgUrl).then(res => {
    markImg.value = res as string
  })
}
const addWatermark = (url: string) => {
  return new Promise(resolve => {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')!
    let image = document.createElement('img')
    let water = document.createElement('img')
    image.src = url
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0)
      let width = image.width * 0.3
      let height = (width * 61) / 104
      let x = image.width - width - 10
      let y = 20
      water.src = new URL('../assets/watermark.png', import.meta.url).href
      water.onload = () => {
        context.drawImage(water, 0, 0, 104, 61, x, y, width, height)
        // resolve(canvas.toDataURL()) // 转成base64，不推荐
        canvas.toBlob(blob => resolve(URL.createObjectURL(blob as Blob))) // 生成url
      }
    }
  })
}
</script>
<style lang="less" scoped>
img {
  width: 300px;
}
.el-button {
  margin-bottom: 8px;
}
</style>
