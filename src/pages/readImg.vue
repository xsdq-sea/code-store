<template>
  <div>
    <input type="file" accept="image/*" @change="fileChange" />
    <br />
    <img :src="base64Img" />
    <img :src="imgUrl" />
  </div>
</template>
<script setup lang="ts">
import Toast from '@/components/toast'

const base64Img = ref('')
const imgUrl = ref('')
const readFile = (file: File) => {
  return new Promise<string>(resolve => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }
  })
}

const fileChange = (event: Event) => {
  let file = (event.target as HTMLInputElement)!.files![0]
  if (!file.type.startsWith('image')) return Toast('请选择图片')
  // 使用fileReader转成base64
  readFile(file).then(url => (base64Img.value = url))
  // 直接通过file/blob创建url
  imgUrl.value = URL.createObjectURL(file)
}
</script>
<style lang="less" scoped>
img {
  margin-top: 24px;
  width: 300px;
  margin-right: 8px;
}
</style>
