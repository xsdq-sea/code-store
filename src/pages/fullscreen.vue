<template>
  <div class="full-screen" ref="fullEl">
    <div class="tool">
      <el-button type="primary" @click="full">
        {{ isFullScreen ? '退出全屏' : '全屏' }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {fullScreen} from '@/utils/fullscreen'

const fullEl = ref<HTMLElement>()
const isFullScreen = ref(false)
const full = () => {
  fullScreen(fullEl.value!, (e: boolean) => {
    isFullScreen.value = e
  })
}
</script>
<style lang="less" scoped>
.full-screen {
  background-image: linear-gradient(to right bottom, white, rgba(0, 0, 0, 0.3));
  width: 400px;
  height: 300px;
  border: 1px solid #ccc;
  position: relative;
  .tool {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: right;
    padding: 4px 16px;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>
