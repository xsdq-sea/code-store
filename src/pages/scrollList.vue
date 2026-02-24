<template>
  <scroll-list :class="{vertical}" :gap="24" can-scroll :vertical="vertical">
    <template #left>
      <el-icon><ArrowLeft /></el-icon>
    </template>
    <div class="list">
      <div class="item" v-for="item in 9" :key="item">{{ item }}</div>
    </div>
    <template #right>
      <el-icon><ArrowRight /></el-icon>
    </template>
  </scroll-list>
</template>

<script setup lang="ts">
import scrollList from '@/components/scrollList.vue'
const vertical = ref(false)
</script>
<style lang="less" scoped>
.scroll-list {
  width: 100%;
  &.vertical {
    width: 300px;
    height: 552px;
    .list {
      flex-direction: column;
      .item {
        width: 100%;
      }
    }
  }
  .list {
    display: flex;
    align-items: center;
    gap: 24px;
    .item {
      border: 1px solid grey;
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc((100% - 72px) / 4);
      height: 120px;
      flex-shrink: 0;
    }
  }
}

@media screen and (max-width: 1200px) {
  .scroll-list .list .item {
    width: calc((100% - 48px) / 3);
  }
}
@media screen and (max-width: 860px) {
  .scroll-list .list .item {
    width: calc((100% - 24px) / 2);
  }
}
</style>
