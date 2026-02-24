<template>
  <div class="scroll-list" :class="{rtl: isRtl, vertical}" @wheel="wheelHandler">
    <span class="arrow left" @click="scroll(-1)" v-show="showLeft">
      <slot name="left">&lt;</slot>
    </span>
    <div class="layer" ref="layer">
      <slot></slot>
    </div>
    <span class="arrow right" @click="scroll(1)" v-show="showRight">
      <slot name="right">&gt;</slot>
    </span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  gap: number
  canScroll?: boolean
  vertical?: boolean
}>()
const layer = ref<HTMLElement>()
const showLeft = ref(false)
const showRight = ref(false)
const isRtl = ref(false)

onMounted(() => {
  new ResizeObserver(() => scroll(0)).observe(layer.value!)
  new MutationObserver(() => scroll(0)).observe(layer.value!, {childList: true})
})

const wheelHandler = (e: WheelEvent) => {
  if (props.canScroll) scroll(e.deltaY / Math.abs(e.deltaY))
}

const scroll = (d: number) => {
  if (!props.vertical) {
    let b = isRtl.value ? -1 : 1
    let scrollLeft = layer.value!.scrollLeft + b * d * (layer.value!.offsetWidth + props.gap)
    if (isRtl.value) scrollLeft = Math.max(Math.min(scrollLeft, 0), layer.value!.offsetWidth - layer.value!.scrollWidth)
    else scrollLeft = Math.min(Math.max(scrollLeft, 0), layer.value!.scrollWidth - layer.value!.offsetWidth)
    if (d) layer.value!.scrollLeft = scrollLeft
    showLeft.value = b * scrollLeft > 0
    showRight.value = b * scrollLeft + layer.value!.offsetWidth < layer.value!.scrollWidth
  } else {
    let scrollTop = layer.value!.scrollTop + d * (layer.value!.offsetHeight + props.gap)
    scrollTop = Math.min(Math.max(scrollTop, 0), layer.value!.scrollHeight - layer.value!.offsetHeight)
    if (d) layer.value!.scrollTop = scrollTop
    showLeft.value = scrollTop > 0
    showRight.value = scrollTop + layer.value!.offsetHeight < layer.value!.scrollHeight
  }
}
</script>
<style lang="less" scoped>
.scroll-list {
  position: relative;
  &:not(.vertical).rtl {
    direction: rtl;
    .arrow {
      transform: rotate(180deg);
      &.left {
        left: auto;
        right: 0;
      }
      &.right {
        left: 0;
        right: auto;
      }
    }
  }
  &.vertical .arrow {
    top: 0;
    left: 50%;
    transform: translate(-50%) rotate(90deg);

    &.right {
      top: auto;
      bottom: 0;
    }
  }

  .arrow {
    position: absolute;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    cursor: pointer;
    &.right {
      right: 0;
    }
  }
  .layer {
    height: 100%;
    overflow: hidden;
  }
}
</style>
