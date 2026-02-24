<template>
  <div class="content">
    <div class="item" v-for="i in 250" :key="i">{{ i }}</div>
  </div>
  <div class="scroll-fixed" ref="box">
    <div class="item" v-for="i in 80" :key="i">{{ i }}</div>
  </div>
</template>
<script lang="ts" setup>
onMounted(() => {
  window.addEventListener('scroll', scroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scroll)
})

const box = ref<HTMLElement>()
const lastScrollTop = ref(0)
const fixedPosition = ref('')
const space = 20
const scroll = () => {
  if (box.value!.offsetHeight < window.innerHeight - space) {
    box.value!.style.position = 'sticky'
    box.value!.style.top = space + 'px'
    return
  }
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let direction = lastScrollTop.value < scrollTop ? 'scrollUp' : 'scrollDown'
  lastScrollTop.value = scrollTop
  if (direction === 'scrollDown') {
    if (box.value!.style.position !== 'relative' && fixedPosition.value === 'bottom') {
      box.value!.style.position = 'relative'
      box.value!.style.top = scrollTop - space - (box.value!.offsetHeight - window.innerHeight) + 'px'
    }
    if (box.value!.getBoundingClientRect().top >= space) {
      box.value!.style.position = 'sticky'
      box.value!.style.top = space + 'px'
      fixedPosition.value = 'top'
    }
  } else if (direction === 'scrollUp') {
    if (box.value!.style.position !== 'relative' && fixedPosition.value === 'top') {
      box.value!.style.position = 'relative'
      box.value!.style.top = Math.max(scrollTop - space, 0) + 'px'
    }
    if (box.value!.getBoundingClientRect().bottom <= window.innerHeight - space) {
      box.value!.style.position = 'sticky'
      box.value!.style.top = window.innerHeight - box.value!.offsetHeight - space + 'px'
      fixedPosition.value = 'bottom'
    }
  }
}
</script>
<style lang="less" scoped>
.scroll-fixed {
  border: 1px solid gray;
  width: 220px;
}
.content {
  width: 100px;
  margin-right: 16px;
  border: 1px solid gray;
}
.item {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
