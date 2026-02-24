<template>
  <div class="outer">
    <div class="box">
      <div class="front">我是前面的内容</div>
      <div class="back">我是后面的内容</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="less" scoped>
.outer {
  width: 300px;
  height: 400px;
  perspective: 1200px;
  &:hover .box {
    transform: rotateY(180deg);
  }
  .box {
    position: relative;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.5s ease-in-out;
    .front,
    .back {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      color: white;
      padding: 16px;
      border-radius: 6px;
    }
    .front {
      background-color: rgb(245, 67, 67);
    }
    .back {
      background-color: rgb(69, 69, 243);
      transform: rotateY(180deg);
    }
  }
}
</style>
