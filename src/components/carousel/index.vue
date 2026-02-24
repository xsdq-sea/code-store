<template>
  <div class="carousel" @mouseenter="hover = true" @mouseleave="hover = false">
    <div @click="turnPage(-1)" class="carousel-arrow left" v-show="showArrow">
      <slot name="left">&lt;</slot>
    </div>
    <div @click="turnPage(1)" class="carousel-arrow right" v-show="showArrow">
      <slot name="right">&gt;</slot>
    </div>
    <div class="carousel-list" ref="list">
      <div class="carousel-inner" ref="inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    column?: number
    spacing: number
    arrow?: 'always' | 'hover'
  }>(),
  {
    column: 2,
    spacing: 16,
    arrow: 'hover'
  }
)

const hover = ref(false)

const slots = useSlots()
const itemCount = computed(() => {
  let count = 0
  slots.default?.().forEach((item: any) => {
    if (item.type.toString() === 'Symbol(v-fgt)') {
      count = item.children.length
    }
  })
  return count
})
const showArrow = computed(() => (props.arrow === 'always' ? true : hover.value))

watch(
  () => props.column,
  () => {
    if (itemCount.value - leftCount.value < props.column) {
      leftCount.value = Math.max(itemCount.value - props.column, 0)
    }
    resize()
  }
)

watch(
  () => props.spacing,
  () => resize()
)

onMounted(() => {
  resize()
})

const resize = async () => {
  inner.value.style.transition = 'none'
  await nextTick()
  calculateItemWidth()
}

const translateX = () => {
  let offset = -(itemWidth.value + props.spacing) * leftCount.value + 'px'
  inner.value.style.transform = `translateX(${offset})`
}

const list = ref()
const itemWidth = ref(0)
const calculateItemWidth = () => {
  itemWidth.value = (list.value.offsetWidth - (props.column - 1) * props.spacing) / props.column
  Array.from(inner.value.children).forEach((item: any) => {
    item.style.width = itemWidth.value + 'px'
    item.style.marginLeft = props.spacing + 'px'
  })
  translateX()
}

const inner = ref()
const leftCount = ref(0)
const turnPage = (b: number) => {
  inner.value.style.transition = 'transform 0.3s'
  if (b === -1) {
    leftCount.value -= Math.min(leftCount.value, props.column)
  } else {
    let remainCount = Math.max(itemCount.value - leftCount.value - props.column, 0)
    leftCount.value += Math.min(remainCount, props.column)
  }
  translateX()
}

defineExpose({resize})
</script>

<style scoped lang="less">
.carousel {
  position: relative;
  height: 100%;
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 1;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
  }
  .carousel-list {
    height: 100%;
    overflow: hidden;
    .carousel-inner {
      height: 100%;
      white-space: nowrap;
      text-align: center;
    }
  }
}
</style>
