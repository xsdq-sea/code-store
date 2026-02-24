<template>
  <div class="box" @dragover="dragover" @drop="dropHandler">
    <p>请将图片拖拽至此</p>
  </div>
</template>
<script setup lang="ts">
const dragover = (event: DragEvent) => {
  event.preventDefault()
}

const dropHandler = (event: DragEvent) => {
  let file = event.dataTransfer!.files[0]
  if (file.type.startsWith('image')) {
    let img = document.createElement('img')
    img.src = URL.createObjectURL(file)
    const box = document.querySelector('.box')!
    box.appendChild(img)
  }
  event.preventDefault()
}
</script>
<style lang="less" scoped>
.box {
  position: relative;
  width: 500px;
  height: 300px;
  background-color: rgb(248, 215, 215);
  p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  :deep(img) {
    height: 100%;
    position: relative;
    z-index: 1;
  }
}
</style>
