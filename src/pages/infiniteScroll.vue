<template>
  <div class="box" ref="box">
    <div class="content" ref="content" @mouseover="pause" @mouseout="play">
      <img v-for="(item, index) in imgList" :src="item" :key="index" />
    </div>
  </div>
</template>
<script setup lang="ts">
const count = ref(4)

const box = ref<HTMLElement>()
const content = ref<HTMLElement>()
onMounted(() => {
  const maxImgWidth = count.value * 320
  const copy = maxImgWidth > box.value!.offsetWidth
  initData(copy)
  if (copy) {
    const time = maxImgWidth / 100
    content.value!.style.animationDuration = time + 's'
  } else {
    box.value!.style.textAlign = 'center'
  }
})

const imgList = ref<string[]>([])
const initData = (copy: boolean) => {
  for (let i = 1; i <= count.value; i++) {
    let img = new URL(`../assets/${i}.jpeg`, import.meta.url).href
    imgList.value.push(img)
  }
  if (copy) imgList.value = [...imgList.value, ...imgList.value]
}
const pause = () => {
  content.value!.style.animationPlayState = 'paused'
}
const play = () => {
  content.value!.style.animationPlayState = ''
}
</script>
<style lang="less" scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-25%);
  }
  100% {
    transform: translateX(-50%);
  }
}
.box {
  width: 1000px;
  height: 200px;
  border: 1px solid gray;
  overflow: hidden;
  .content {
    display: inline-block;
    height: 100%;
    white-space: nowrap;
    animation: scroll linear infinite;
    img {
      width: 320px;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
