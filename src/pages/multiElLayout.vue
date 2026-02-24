<template>
  <div class="multi-layout">
    <div class="header">
      <el-button @click="add">新增</el-button>
      <el-popover popper-class="layout-popover" v-model:visible="show" trigger="click" placement="bottom-end">
        <template #reference>
          <svg-icon iconClass="icon-layout"></svg-icon>
        </template>
        <div
          class="item"
          :class="{active: current === item.key}"
          @click="layout(item.key)"
          v-for="item in layoutList"
          :key="item.key"
        >
          <svg-icon :iconClass="`icon-layout-${item.key}`"></svg-icon>
          {{ item.name }}
        </div>
        <div class="count-list" v-if="count > 2 && count <= 10">
          <svg-icon
            :class="{active: current === item}"
            v-for="(item, index) in countListMap[count]"
            :key="index"
            :iconClass="`icon-layout-${item}`"
            @click="layout(item)"
          ></svg-icon>
        </div>
      </el-popover>
    </div>
    <div class="box" ref="box"></div>
  </div>
</template>
<script setup>
const show = ref(false)
const current = ref('')
const box = ref(null)
const tile = ref(false)
const count = ref(0)
const layoutList = reactive([
  {name: '自动平铺', key: 'auto'},
  {name: '层叠排列', key: 'stack'},
  {name: '纵向排列', key: 'h'},
  {name: '横向排列', key: 'v'}
])

const countListMap = reactive({
  3: ['111', '3', '12'],
  4: ['4', '13', '22', '112', '1111'],
  5: ['14', '23', '113', '122', '1112'],
  6: ['24', '123', '1122'],
  7: ['133', '223', '1123', '124'],
  8: ['224', '233', '1223'],
  9: ['144', '234', '1233', '2223'],
  10: ['244', '334', '1234', '1333', '2233']
})

const add = () => {
  const item = document.createElement('div')
  item.className = 'item'
  item.textContent = count.value + 1
  box.value.appendChild(item)
  count.value++
  if (tile.value) calcInitialRect(item)
}

let initialPosition = {x: 0, y: 0}
const calcInitialRect = item => {
  initialPosition.x += 30
  initialPosition.y += 30

  const {offsetHeight, offsetWidth} = box.value
  const height = offsetHeight * 0.7
  const width = offsetWidth - offsetHeight * 0.3
  if (initialPosition.x + width > offsetWidth || initialPosition.y + height > offsetHeight) {
    initialPosition = {x: 0, y: 0}
  }

  item.style.left = initialPosition.x + 'px'
  item.style.top = initialPosition.y + 'px'
  item.style.width = width + 'px'
  item.style.height = height + 'px'
}

const layout = type => {
  tile.value = true
  show.value = false
  current.value = type

  initialPosition = {x: 0, y: 0}
  let itemList = box.value.querySelectorAll('.item')
  let count = itemList.length
  if (type === 'stack') itemList.forEach(item => calcInitialRect(item))
  else {
    let list = []
    if (type === 'auto') {
      let magic = Math.floor(Math.sqrt(count)) // 第一列数量
      let column = Math.floor(count / magic) // 列数
      let extern = count % magic // 剩余

      for (let i = column - 1; i >= 0; i--) {
        if (extern > 0) {
          list[i] = magic + 1
          extern--
        } else list[i] = magic
      }
    } else if (type === 'h') list = [itemList.length]
    else if (type === 'v') list = Array(itemList.length).fill(1)
    else list = type.split('')

    let column = list.length
    let width = box.value.offsetWidth / column
    let index = 0
    list.forEach((row, i) => {
      let height = box.value.offsetHeight / row
      for (let j = 0; j < row; j++) {
        let item = itemList[index]
        item.style.left = i * width + 'px'
        item.style.top = j * height + 'px'
        item.style.width = width + 'px'
        item.style.height = height + 'px'
        index++
      }
    })
  }
}
</script>
<style lang="less" scoped>
.multi-layout {
  width: 100%;
  height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .box {
    flex: 1;
    border: 1px solid #333;
    position: relative;
    :deep(.item) {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border: 1px solid #e9e9e9;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    }
  }
}
</style>
<style lang="less">
.layout-popover {
  padding: 4px 0 !important;
  width: auto !important;
  .svg-icon {
    font-size: 24px;
    cursor: pointer;
    cursor: pointer;
  }
  .item {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f6;
    }
    &.active {
      background-color: #01e0af;
    }
    .svg-icon {
      margin-right: 8px;
    }
  }
  .count-list {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    .svg-icon {
      flex-shrink: 0;
      &:hover {
        background-color: #f5f5f6;
      }
      &.active {
        background-color: #01e0af;
        border-radius: 4px;
      }
      & + .svg-icon {
        margin-left: 12px;
      }
    }
  }
}
</style>
