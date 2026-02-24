<template>
  <div class="container">
    <div class="box">
      <div
        class="item"
        v-for="_ in 10"
        :key="_"
        :style="{transform: `rotateY(${_ * 36}deg) translateZ(220px)`, backgroundColor: getColor()}"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
const getColor = () => {
  const red = Math.round(Math.random() * 255)
  const green = Math.round(Math.random() * 255)
  const blue = Math.round(Math.random() * 255)
  return `rgb(${red}, ${green}, ${blue})`
}
</script>
<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotateX(-8deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(-8deg) rotateY(360deg);
  }
}
.container {
  width: 460px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800;
}
.box {
  width: 120px;
  height: 90px;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate 15s linear infinite;
  .item {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    backface-visibility: visible;
  }
}
</style>
