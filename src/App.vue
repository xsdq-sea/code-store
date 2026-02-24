<template>
  <el-scrollbar class="menu-scroll" height="100%">
    <el-menu :default-active="activeIndex" router>
      <el-menu-item v-for="item in sortRoutes" :index="item.path" :key="item.name">
        {{ item.meta?.name }}
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
  <div class="child">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {routes} from '@/router'

const route = useRoute()
const activeIndex = ref('/')
watch(route, () => (activeIndex.value = route.path))

const sortRoutes = computed(() => [...routes].sort((a, b) => a.meta.name.localeCompare(b.meta.name, 'zh')))
</script>

<style lang="less">
#app {
  .menu-scroll {
    width: 180px;
    position: fixed;
    .el-menu {
      min-height: 100vh;
      padding: 16px 0;
      .el-menu-item {
        line-height: 40px;
        height: 40px;
      }
    }
  }
  .child {
    padding: 16px 16px 16px 200px;
    display: flex;
    align-items: flex-start;
  }
}
@media screen and (max-width: 500px) {
  #app {
    .menu-scroll {
      display: none;
    }
    .child {
      padding: 16px;
    }
  }
}
</style>
