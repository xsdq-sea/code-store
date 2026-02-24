import 'virtual:svg-icons-register'
import './css/index.less'
import {Slider, SliderDirection} from './slider.js'
import {Selector} from './selector.js'
import {ColorPicker} from './colorPicker.js'
import {PercentSlider} from './percentSlider.js'
import {RangeSlider} from './rangeSlider.js'
import {Dialog} from './dialog.js'
import {createIcon} from './icon.js'
import {Checkbox} from './checkbox.js'
import {CheckboxGroup} from './checkboxGroup.js'
import {MessageBox} from './messagebox.js'
import {Drawer} from './drawer.js'
import {CloseType} from './define.js'
import {Radio} from './radio.js'
import {RadioGroup} from './radioGroup.js'

const svg = createIcon('arrow-down', {size: '24px', color: 'red'})
document.body.appendChild(svg)

// 滑块
const rangeSlider = new Slider({range: true})
rangeSlider.value = [20, 30]
rangeSlider.min = 10
rangeSlider.max = 50
document.body.appendChild(rangeSlider)

const slider = new Slider()
slider.min = 15
slider.max = 30
slider.value = 20
document.body.appendChild(slider)

document.body.appendChild(
  new Slider({
    value: [20, 30],
    range: true,
    direction: SliderDirection.VERTICAL,
    min: 10,
    max: 50,
    className: 'custom-slider'
  })
)
document.body.appendChild(
  new Slider({
    value: 20,
    direction: SliderDirection.VERTICAL,
    className: 'vertical-slider'
  })
)

// 下拉框
const selector = new Selector({
  className: 'multiple-selector',
  value: 2
})
selector.items = [
  {label: '选项一', value: 1},
  {label: '选项二', value: 2},
  {label: '选项三', value: 3}
]
selector.addEventListener('change', e => {
  console.log((e as CustomEvent).detail)
  console.log(selector.value)
})
document.body.appendChild(selector)

const mulSelector = new Selector({
  multiple: true,
  className: 'custom-selector',
  items: [
    {label: '选项一', value: 1},
    {label: '选项二', value: 2},
    {label: '选项三', value: 3},
    {label: '选项四', value: 4},
    {label: '选项五', value: 5},
    {label: '选项六', value: 6}
  ]
})
mulSelector.value = [2, 3]
mulSelector.addEventListener('change', e => {
  console.log((e as CustomEvent).detail)
  console.log(mulSelector.value)
})
document.body.appendChild(mulSelector)

// 百分比滑块;
const percentSlider = new PercentSlider()
percentSlider.value = 20
percentSlider.addEventListener('change', e => {
  console.log((e as CustomEvent).detail)
})
document.body.appendChild(percentSlider)

// 带输入框的范围滑块
const rangeSlider2 = new RangeSlider()
rangeSlider2.min = 1
rangeSlider2.max = 52
document.body.appendChild(rangeSlider2)

// 颜色选择器
const trigger = document.createElement('div')
trigger.textContent = '打开颜色选择器'
trigger.style.color = 'var(--color)'

const colorPicker = new ColorPicker()
// colorPicker.trigger = trigger;
colorPicker.color = '#ba68c8'

colorPicker.addEventListener('change', e => {
  console.log((e as CustomEvent).detail, colorPicker.color)
})
document.body.appendChild(colorPicker)

// 弹框
const dialog = new Dialog({
  showModal: true,
  resizable: true,
  title: '对话框',
  beforeClose: (type, done) => {
    if (type === CloseType.CONFIRM) {
      setTimeout(() => {
        done()
      }, 500)
    } else done()
  }
})
dialog.body.innerHTML = `
			<div>我是弹框的内容</div>
		`

const dialogBtn = document.createElement('button')
dialogBtn.textContent = '打开对话框'
dialogBtn.addEventListener('click', () => {
  dialog.open({title: '对话框1', cancelTxt: '取消1', confirmTxt: '确定1', top: '100px'})
})
document.body.appendChild(dialogBtn)

// 复选框
const checkbox = new Checkbox({checked: true, label: '复选框'})
checkbox.addEventListener('change', () => {
  console.log(checkbox.checked)
})
document.body.appendChild(checkbox)

// 复选框组
const checkboxGroup = new CheckboxGroup({value: [1, 2, 4]})
checkboxGroup.items = [
  {label: '选项一', value: 1},
  {label: '选项二', value: 2},
  {label: '选项三', value: 3},
  {label: '选项四', value: 4, disabled: true}
]
checkboxGroup.addEventListener('change', () => {
  console.log(checkboxGroup.value)
})
document.body.appendChild(checkboxGroup)

// 单选按钮
const radio = new Radio({checked: false, label: '单选框'})
radio.addEventListener('change', () => {
  console.log(radio.checked)
})
document.body.appendChild(radio)

// 单选按钮组
const radioGroup = new RadioGroup({value: 'c'})
radioGroup.items = [
  {label: '选项A', value: 'a'},
  {label: '选项B', value: 'b'},
  {label: '选项C', value: 'c', disabled: true},
  {label: '选项D', value: 'd'}
]
radioGroup.addEventListener('change', () => {
  console.log(radioGroup.value)
})
document.body.appendChild(radioGroup)

// 消息确认框
const msgBtn = document.createElement('button')
msgBtn.textContent = '消息确认框'
msgBtn.addEventListener('click', () => {
  MessageBox.confirm('消息框内容', '提示', {
    cancelTxt: '别BB',
    confirmTxt: '晓得了'
  })
    .then(() => {
      console.log('确定')
    })
    .catch(err => {
      console.log('点击了' + err)
    })
})
document.body.appendChild(msgBtn)

// 抽屉
const drawer = new Drawer({
  title: '抽屉'
  // showFooter: true,
})

const drawerBtn = document.createElement('button')
drawerBtn.textContent = '打开抽屉'
drawerBtn.addEventListener('click', () => {
  drawer.open()
})
document.body.appendChild(drawerBtn)
