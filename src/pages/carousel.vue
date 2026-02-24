<template>
  <div class="carousel-demo" style="width: 100%">
    <div class="box" :style="{width}">
      <carousel :column="column" :spacing="spacing" :arrow="arrow" ref="carouselEl">
        <template #left>
          <el-icon><ArrowLeft /></el-icon>
        </template>
        <template #right>
          <el-icon><ArrowRight /></el-icon>
        </template>
        <carousel-item v-for="(item, index) in list" :key="index" @click.native="click">
          <img class="image" :src="item.img" />
          <p class="label">{{ item.label }}</p>
        </carousel-item>
      </carousel>
    </div>
    <p>
      <span style="margin-top: 10px; margin-right: 10px; display: inline-block">
        改变列数：
        <el-input-number v-model="column" step-strictly :min="1"></el-input-number>
      </span>
      <span>
        改变间距：
        <el-input-number v-model="spacing" :min="0"></el-input-number>
      </span>
    </p>
    <p>
      改变容器宽度：
      <el-select v-model="width" @change="carouselEl!.resize()">
        <el-option value="300px"></el-option>
        <el-option value="400px"></el-option>
        <el-option value="500px"></el-option>
        <el-option value="600px"></el-option>
        <el-option value="700px"></el-option>
        <el-option value="800px"></el-option>
        <el-option value="900px"></el-option>
        <el-option value="100%"></el-option>
      </el-select>
      <span v-if="width === '100%'" style="margin-left: 16px">改变窗口宽度试试</span>
    </p>
    <p>
      箭头显示方式：
      <el-select v-model="arrow">
        <el-option value="always"></el-option>
        <el-option value="hover"></el-option>
      </el-select>
    </p>
  </div>
</template>

<script setup lang="ts">
import carousel from '@/components/carousel/index.vue'

const width = ref('600px')
const column = ref(2)
const spacing = ref(10)
const arrow = ref<'hover' | 'always'>('hover')
const list = [
  {img: new URL('../assets/1.jpeg', import.meta.url).href, label: '这是第一张图片'},
  {img: new URL('../assets/2.jpeg', import.meta.url).href, label: '这是第二张图片'},
  {img: new URL('../assets/3.jpeg', import.meta.url).href, label: '这是第三张图片'},
  {img: new URL('../assets/4.jpeg', import.meta.url).href, label: '这是第四张图片'},
  {img: new URL('../assets/5.jpeg', import.meta.url).href, label: '这是第五张图片'},
  {img: new URL('../assets/6.jpeg', import.meta.url).href, label: '这是第六张图片'},
  {img: new URL('../assets/7.jpeg', import.meta.url).href, label: '这是第七张图片'}
]

const carouselEl = ref<typeof carousel>()
const resize = () => carouselEl.value!.resize()
window.addEventListener('resize', resize)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

const click = () => {}
</script>

<style lang="less" scoped>
.carousel-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box {
  height: 300px;
  .image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .label {
    position: absolute;
    bottom: 0;
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    text-align: center;
    left: 0;
    right: 0;
    margin: 0;
    padding: 5px 10px;
  }
}
</style>
