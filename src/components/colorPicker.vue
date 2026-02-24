<template>
  <el-popover
    v-model:visible="showPicker"
    class="color-picker"
    trigger="click"
    :visible-arrow="false"
    popper-class="color-picker-popper"
    @after-enter="setSliderBarBg"
    @after-leave="showCustom = false"
  >
    <template #reference>
      <span class="reference">
        <span :style="{backgroundColor: modelValue}"></span>
      </span>
    </template>
    <div class="color-panel" v-show="!showCustom">
      <div class="default-list">
        <span
          v-for="(item, index) in defaultList"
          :key="index"
          :class="['item', {active: currentColor === item}]"
          @click="clickColor(item)"
        >
          <span :style="{backgroundColor: item}"></span>
        </span>
      </div>
      <div class="custom-color">
        <div class="line">
          <el-checkbox v-model="custom">自定义颜色</el-checkbox>
          <div class="input-color">
            #
            <el-input :modelValue="inputColor" @input="colorInput"></el-input>
            <span :style="{backgroundColor: currentColor}" @click="toCustom"></span>
          </div>
        </div>
        <div class="line">
          <el-slider v-model="alpha" :show-tooltip="false" ref="slider" @input="change"></el-slider>
          <el-input
            class="alpha"
            :modelValue="inputAlpha"
            :placeholder="placeholder"
            @blur="inputAlpha = alpha + '%'"
            @focus="inputAlpha = ''"
            @input="alphaInput"
            @change="change"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="custom-panel" v-show="showCustom">
      <el-icon @click="showCustom = false"><ArrowLeft /></el-icon>
      <div class="color">
        <div
          class="left"
          @mousedown="mousedownHandler"
          ref="svpanel"
          :style="{backgroundColor: `hsl(${hsv.h}, 100%, 50%)`}"
        >
          <div class="svpanel_white"></div>
          <div class="svpanel_black"></div>
          <div class="svpanel_cursor" :style="cursorPostion"></div>
        </div>
        <el-slider v-model="hsv.h" :max="360" vertical :show-tooltip="false" @change="setCurrentColor"></el-slider>
      </div>
      <div class="bottom">
        <span class="lump" :style="{backgroundColor: currentColor}"></span>
        <span class="value">
          #
          <el-input :modelValue="inputColor" @input="colorInput"></el-input>
        </span>
        <el-button @click="confirm(true)">确定</el-button>
      </div>
    </div>
  </el-popover>
</template>
<script setup>
const defaultList = [
  '#ffffff',
  '#e2e2e2',
  '#cccccc',
  '#9a9a9a',
  '#7f7f7f',
  '#666666',
  '#4c4c4c',
  '#333333',
  '#191919',
  '#000000',
  '#f44336',
  '#ff9800',
  '#ffeb3b',
  '#4caf50',
  '#009688',
  '#00bcd4',
  '#2196f3',
  '#673ab7',
  '#9c27b0',
  '#e91e63',
  '#ffcdd2',
  '#ffe0b2',
  '#ffe7ba',
  '#c8e6c9',
  '#b2dfdb',
  '#b2ebf2',
  '#bbdefb',
  '#d1c4e9',
  '#e1bee7',
  '#f8bbd0',
  '#ef9a9a',
  '#ffcc80',
  '#fff59d',
  '#a5d6a7',
  '#80cbc4',
  '#80deea',
  '#90caf9',
  '#b39ddb',
  '#ce93d8',
  '#f48fb1',
  '#e57373',
  '#ffb74d',
  '#fff176',
  '#81c784',
  '#4db6ac',
  '#4dd0e1',
  '#64b5f6',
  '#9575cd',
  '#ba68c8',
  '#f06292',
  '#ef5350',
  '#ffa726',
  '#ffee58',
  '#66bb6a',
  '#26a69a',
  '#26c6da',
  '#42a5f5',
  '#8057c2',
  '#ab47bc',
  '#ec407a',
  '#d32f2f',
  '#f55100',
  '#fbc02d',
  '#388e3c',
  '#00796b',
  '#0097a7',
  '#1976d2',
  '#512da8',
  '#7b1fa2',
  '#c2185b',
  '#b71c1c',
  '#e65100',
  '#f57f17',
  '#1b5e20',
  '#004d40',
  '#006064',
  '#0d47a1',
  '#311b92',
  '#4a148c',
  '#880e4f'
]

const props = defineProps({modelValue: String, toRgb: Boolean})
const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const custom = ref(true)
const hsv = ref({})

const color2hexa = val => {
  let hex, alpha
  if (val.startsWith('#')) {
    let result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(val)
    hex = val.slice(0, 7)
    if (result[4]) alpha = Math.round((parseInt(result[4], 16) / 255) * 100)
    else alpha = 100
  } else if (val.startsWith('rgb')) {
    let result = /^rgba?\((.+)\)$/.exec(val)
    let [r, g, b, a] = result[1].split(',')
    hex = rgb2hex({r, g, b})
    if (a) alpha = Math.round(a * 100)
    else alpha = 100
  }
  return {hex, alpha}
}

const currentColor = ref('')
const inputColor = ref('')
const inputAlpha = ref(0)
const alpha = ref(0)
watch(
  () => props.modelValue,
  val => {
    if (!val) return
    let {hex, alpha: a} = color2hexa(val)
    currentColor.value = hex
    alpha.value = a
    inputAlpha.value = a + '%'
    if (showPicker.value) setSliderBarBg()
  },
  {immediate: true}
)

watch(showPicker, val => {
  if (val) inputColor.value = currentColor.value.slice(1)
})

const slider = ref(null)
const setSliderBarBg = () => {
  let sliderBar = slider.value.$el.querySelector('.el-slider__bar')
  let {r, g, b} = hex2rgb(currentColor.value)
  let rgbStr = `${r}, ${g}, ${b}`
  sliderBar.style.backgroundImage = `linear-gradient(to right, rgba(${rgbStr}, 0), rgb(${rgbStr}))`
}

const clickColor = item => {
  currentColor.value = item
  alpha.value = 100
  confirm(true)
}

const colorInput = val => {
  inputColor.value = val.replace(/[^0-9a-fA-F]/, '').slice(0, 6)
  if (inputColor.value.length === 6) currentColor.value = '#' + inputColor.value
  else if (inputColor.value.length === 3) {
    currentColor.value = '#' + [...inputColor.value].map(item => `${item}${item}`).join('')
  } else currentColor.value = '#000000'
  hsv.value = rgb2hsv(hex2rgb(currentColor.value))
  setCursorPosition()
  confirm()
}

const confirm = close => {
  if (!currentColor.value) return
  let a = alpha.value / 100
  if (props.toRgb) {
    let {r, g, b} = hex2rgb(currentColor.value)
    emit('update:modelValue', `rgba(${r}, ${g}, ${b}, ${a})`)
  } else {
    a = Math.round(255 * a)
      .toString(16)
      .padStart(2, '0')
    emit('update:modelValue', currentColor.value + a)
  }

  if (close) showPicker.value = false
}

const hex2rgb = hex => {
  let result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex)
  if (!result) return
  let r = parseInt(result[1], 16)
  let g = parseInt(result[2], 16)
  let b = parseInt(result[3], 16)
  return {r, g, b}
}

const placeholder = computed(() => alpha.value + '%')

const alphaInput = val => {
  let alpha = Number(val.replace(/[^0-9]/g, ''))
  inputAlpha.value = Math.min(Math.max(alpha, 0), 100)
}

const change = val => {
  alpha.value = Number(val)
  confirm(false)
}

const showCustom = ref(false)
const cursorPostion = ref({left: 0, top: 0})
const svpanel = ref(null)
const toCustom = () => {
  if (!custom.value) return
  showCustom.value = true
  hsv.value = rgb2hsv(hex2rgb(currentColor.value))
  nextTick(() => setCursorPosition())
}

const setCursorPosition = () => {
  if (!showCustom.value) return
  let {s, v} = hsv.value
  let rect = svpanel.value.getBoundingClientRect()
  let left = (s / 100) * rect.width
  let top = ((100 - v) / 100) * rect.height
  cursorPostion.value = {left: left + 'px', top: top + 'px'}
}

const rgb2hsv = ({r, g, b}) => {
  r = r / 255
  g = g / 255
  b = b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  let v = max
  const d = max - min
  s = max === 0 ? 0 : d / max
  if (max === min) h = 0
  else {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else if (max === b) h = (r - g) / d + 4
    h /= 6
  }
  return {h: h * 360, s: s * 100, v: v * 100}
}

let lastEvent = {}
const mousedownHandler = e => {
  mousemoveHandler(e)
  document.onselectstart = () => false
  document.addEventListener('mousemove', mousemoveHandler)
  document.addEventListener('mouseup', mouseupHandler)
}

const mousemoveHandler = e => {
  let {offsetX, offsetY} = lastEvent
  if (offsetX === e.offsetX && offsetY === e.offsetY) return
  lastEvent = e
  let rect = svpanel.value.getBoundingClientRect()
  let left = e.clientX - rect.left
  let top = e.clientY - rect.top
  left = Math.min(Math.max(0, left), rect.width)
  top = Math.min(Math.max(0, top), rect.height)
  cursorPostion.value = {left: left + 'px', top: top + 'px'}
  hsv.value.s = (left / rect.width) * 100
  hsv.value.v = 100 - (top / rect.height) * 100
  setCurrentColor()
}

const mouseupHandler = () => {
  document.onselectstart = null
  document.removeEventListener('mousemove', mousemoveHandler)
  document.removeEventListener('mouseup', mouseupHandler)
}

const setCurrentColor = () => {
  currentColor.value = rgb2hex(hsv2rgb(hsv.value))
  inputColor.value = currentColor.value.slice(1)
}

const rgb2hex = ({r, g, b}) => {
  r = Number(r).toString(16).padStart(2, '0')
  g = Number(g).toString(16).padStart(2, '0')
  b = Number(b).toString(16).padStart(2, '0')
  return '#' + r + g + b
}

const hsv2rgb = ({h, s, v}) => {
  h = (h / 360) * 6
  s = s / 100
  v = v / 100
  const i = Math.floor(h)
  const f = h - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  const mod = i % 6
  const r = [v, q, p, p, t, v][mod]
  const g = [t, v, v, q, p, p][mod]
  const b = [p, p, t, v, v, q][mod]
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}
</script>
<style lang="less" scoped>
.reference {
  display: block;
  width: 32px;
  height: 32px;
  border: 1px solid #edeef0;
  border-radius: 2px;
  padding: 4px;
  span {
    display: block;
    height: 100%;
    border-radius: 2px;
  }
}
.color-panel {
  padding: 12px;
  color: #1f2533;
  .default-list {
    display: grid;
    grid-template-columns: repeat(10, 22px);
    grid-template-rows: repeat(8, 22px);
    .item {
      border-radius: 4px;
      padding: 2px;
      border: 1px solid transparent;
      &.active {
        border: 1px solid #01e0af;
      }
      &:first-child span {
        border: 1px solid #efefef;
      }
      span {
        display: block;
        height: 100%;
        border-radius: 2px;
      }
    }
  }
  .custom-color {
    margin-top: 12px;
    border-top: 1px solid #efefef;
    .line {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      :deep(.el-checkbox) .el-checkbox__label {
        font-size: 12px;
        color: #1f2533;
      }

      :deep(.el-slider) {
        flex: 1;
        .el-slider__runway {
          height: 10px;
          margin: 0;
          background-size: 100%;
        }
        .el-slider__bar {
          height: 100%;
          width: 100% !important;
          border-radius: 5px;
          background: transparent;
        }
        .el-slider__button-wrapper {
          top: -13px;
          .el-slider__button {
            width: 18px;
            height: 18px;
            background-color: white;
            border: 1px solid #efefef;
          }
        }
      }

      .input-color {
        margin-left: 16px;
        border: 1px solid #efefef;
        border-radius: 4px;
        padding: 0 8px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        :deep(.el-input) .el-input__wrapper {
          height: 24px;
          box-shadow: none;
          width: 56px;
          padding: 0;
          font-size: 12px;
          background-color: transparent;
          input {
            height: 100%;
          }
        }
        span {
          flex-shrink: 0;
          margin-left: 8px;
          width: 16px;
          height: 16px;
          border-radius: 2px;
        }
      }
      .alpha {
        margin-left: 20px;
        width: 64px;
        height: 24px;
      }
    }
  }
}
.custom-panel {
  padding: 12px;
  width: 244px;
  color: #1f2533;
  .color {
    display: flex;
    height: 184px;
    .left {
      flex: 1;
      background-color: red;
      position: relative;
      .svpanel_white,
      .svpanel_black {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .svpanel_white {
        background: linear-gradient(90deg, #fff, transparent);
      }
      .svpanel_black {
        background: linear-gradient(0deg, #000, transparent);
      }
      .svpanel_cursor {
        position: absolute;
        width: 4px;
        height: 4px;
        box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3), 0 0 1px 2px rgba(0, 0, 0, 0.4);
        border-radius: 50%;
        transform: translate(-2px, -2px);
        pointer-events: none;
      }
    }
    :deep(.el-slider) {
      width: 18px;
      margin-left: 6px;
      flex: none;
      .el-slider__runway {
        width: 100%;
        margin: 0;
        border-radius: 0;
        background-image: linear-gradient(0deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
      }
      .el-slider__bar {
        display: none;
      }
      .el-slider__button-wrapper {
        left: -9px;
        .el-slider__button {
          width: 18px;
          height: 4px;
          border: 1px solid #efefef;
          box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3), 0 0 1px 2px rgba(0, 0, 0, 0.4);
          background-color: transparent;
          border-radius: 0;
          &.hover {
            transform: none;
          }
        }
      }
    }
  }
  .bottom {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid #efefef;
    display: flex;
    align-items: center;
    .lump {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }
    .value {
      border-radius: 4px;
      border: 1px solid #efefef;
      line-height: 22px;
      padding: 0 8px;
      margin-left: 8px;
      display: flex;
      align-items: center;
      .el-input :deep(.el-input__wrapper) {
        height: 24px;
        box-shadow: none;
        width: 56px;
        padding: 0;
        font-size: 12px;
        background-color: transparent;
        input {
          height: 100%;
        }
      }
    }
    .el-button {
      height: 24px;
      margin-left: auto;
      font-size: 12px;
      border-radius: 4px;
    }
  }
}
</style>
<style lang="less">
.color-picker-popper {
  width: auto !important;
  padding: 0 !important;
}
</style>
