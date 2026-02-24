<template>
  <div class="scroll">
    <div class="inner"></div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="less" scoped>
.scroll {
  height: 400px;
  width: 200px;
  overflow-y: auto;
  border: 1px solid #c3c3c3;
  /* firefox 设置滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(133, 140, 150, 0.3) transparent;
  /* ====================== */
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 6px;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  &::-webkit-scrollbar-track {
  }
  /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(133, 140, 150, 0.3);
  }
  .inner {
    height: 800px;
  }
}
</style>
