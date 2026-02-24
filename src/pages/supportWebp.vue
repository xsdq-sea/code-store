<template>
  <div>是否支持webp图片: {{ support ? '支持' : '不支持' }}</div>
</template>
<script setup lang="ts">
const supportWebp = () => {
  const image = new Image()
  image.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
  return new Promise((resolve, reject) => {
    image.onload = () => {
      if (!window.createImageBitmap) return reject()
      createImageBitmap(image)
        .then(res => {
          console.log(res)
          resolve(true)
        })
        .catch(() => reject())
    }
    image.onerror = () => {
      reject()
    }
  })
}

const support = ref(false)
supportWebp().then(() => {
  support.value = true
})
</script>
<style lang="less" scoped></style>
