<template>
  <div>
    <div class="box" :class="{rtl: right}">
      <div class="text" ref="text">
        <div class="inner" ref="inner">我是一段很长很长的文字，在内容超过容器的时候，我会自动滚动</div>
      </div>
    </div>
    <p>
      <el-button type="primary" @click="right = false">left</el-button>
      <el-button type="primary" @click="right = true">right</el-button>
    </p>
    <p>
      滚动速度：
      <el-input-number
        v-model="speed"
        @change="changeSpeed"
        :step="5"
        :step-strictly="true"
        :value-on-clear="60"
        :min="10"
        :max="200"
      ></el-input-number>
    </p>
  </div>
</template>
<script setup lang="ts">
const text = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const right = ref(false)
onMounted(() => {
  console.log(this)
  changeSpeed(speed.value)
})

const speed = ref(60)
const changeSpeed = (val: number) => {
  const textWidth = text.value!.offsetWidth
  const innerWidth = inner.value!.offsetWidth
  const duration = (innerWidth + textWidth) / val
  inner.value!.style.animationDuration = duration + 's'
}
</script>
<style lang="less" scoped>
@keyframes move {
  0% {
    transform: translate(300px);
  }
  100% {
    transform: translate(-100%);
  }
}
@keyframes move-right {
  0% {
    transform: translate(-300px);
  }
  100% {
    transform: translate(100%);
  }
}
.box {
  width: 332px;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 4px 16px;
  border-radius: 4px;
  &.rtl {
    direction: rtl;
    .inner {
      animation: move-right linear -5s infinite;
    }
  }
  .text {
    overflow: hidden;
  }
  .inner {
    color: white;
    white-space: nowrap;
    display: inline-block;
    animation: move linear -5s infinite;
  }
}
</style>
