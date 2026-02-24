import {ZIndexManager} from './define'
import {createIcon} from './icon'
import {PercentSlider} from './percentSlider'
import {Slider, SliderDirection} from './slider'

const defaultColor: string[] = [
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
  '#2864ff',
  '#673ab7',
  '#9c27b0',
  '#e91e63',
  '#ffcdd2',
  '#ffe0b2',
  '#ffe7ba',
  '#c8e6c9',
  '#b2dfdb',
  '#b2ebf2',
  '#bbdbfb',
  '#d1c4e9',
  '#e1bee7',
  '#f8bbd0',
  '#ef9a9a',
  '#ffcc80',
  '#fff59d',
  '#a5d6a7',
  '#80cbc4',
  '#80deea',
  '#90bff9',
  '#b39ddb',
  '#ce93d8',
  '#f48fb1',
  '#e57373',
  '#ffb74d',
  '#fff176',
  '#81c784',
  '#4db6ac',
  '#4dd0e1',
  '#5c9cf6',
  '#9575cd',
  '#ba68c8',
  '#f06292',
  '#fa5754',
  '#ffa726',
  '#ffee58',
  '#66bb6a',
  '#00c889',
  '#26c6da',
  '#3279f5',
  '#8057c2',
  '#ab47bc',
  '#ec407a',
  '#d32f2f',
  '#f55100',
  '#fbc02d',
  '#388e3c',
  '#00796b',
  '#0097a7',
  '#1849cd',
  '#512da8',
  '#7b1fa2',
  '#c2185b',
  '#b71c1c',
  '#e65100',
  '#f57f17',
  '#1b5e20',
  '#004d40',
  '#006064',
  '#0d3199',
  '#311b92',
  '#4a148c',
  '#880e4f'
]

const customColorList: string[] = localStorage.getItem('customColorList')
  ? JSON.parse(localStorage.getItem('customColorList')!)
  : []

type HexAlpha = {hex: string; alpha: number}

export const color2hexa = (val: string): HexAlpha => {
  let hex: string | undefined
  let alpha: number = 100
  if (val.startsWith('#')) {
    const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(val)
    hex = val.slice(0, 7)
    if (result && result[4]) alpha = Math.round((parseInt(result[4], 16) / 255) * 100)
    else alpha = 100
  } else if (val.startsWith('rgb')) {
    const result = /^rgba?\((.+)\)$/.exec(val)
    const [r, g, b, a] = result![1].split(',')
    hex = rgb2hex({r, g, b})
    if (a) alpha = Math.round(Number(a) * 100)
    else alpha = 100
  }
  return {hex: hex!, alpha}
}
const hex2rgb = (hex: string): {r: number; g: number; b: number} | undefined => {
  const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex)
  if (!result) return undefined
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return {r, g, b}
}
const rgb2hex = (params: {r: string | number; g: string | number; b: string | number}): string => {
  let {r, g, b} = params
  r = Number(r).toString(16).padStart(2, '0')
  g = Number(g).toString(16).padStart(2, '0')
  b = Number(b).toString(16).padStart(2, '0')
  return '#' + r + g + b
}
const rgb2hsv = (params: {r: number; g: number; b: number}): {h: number; s: number; v: number} => {
  let {r, g, b} = params
  r = r / 255
  g = g / 255
  b = b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const v = max
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
const hsv2rgb = (params: {h: number; s: number; v: number}): {r: number; g: number; b: number} => {
  let {h, s, v} = params
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

export class ColorPicker extends HTMLElement {
  private _alpha: number = 100
  private _hexColor: string = ''
  private _hsv?: {h: number; s: number; v: number}
  private _color: string = ''
  private _trigger: HTMLElement
  private _panel: HTMLElement
  private _colorSelector?: HTMLElement
  private _alphaSlider?: PercentSlider
  private _customColor?: HTMLElement
  private _svpanel?: HTMLElement
  private _cursor?: HTMLElement
  private _preview?: HTMLElement
  private _colorInput?: HTMLInputElement
  private _contextMenu?: HTMLElement
  private _contextColor?: HTMLElement
  private _isOpen: boolean = false
  constructor(options?: {color?: string; trigger?: HTMLElement}) {
    super()
    if (options?.color) this._color = options.color

    this.classList.add('custom-color-picker')
    this.style.setProperty('--color', this._color)

    this.addEventListener('click', e => {
      e.stopPropagation()
      if (this._isOpen) this.close()
      else this.open()
    })

    let trigger = options?.trigger
    if (!trigger) {
      trigger = document.createElement('div')
      trigger.className = 'custom-color-picker-trigger'
      trigger.innerHTML = `<div class="custom-color-trigger_inner"></div>`
    }

    this._trigger = trigger
    this.appendChild(trigger)

    const panel = document.createElement('div')
    panel.className = 'custom-color-picker-panel'
    this._panel = panel
    document.body.appendChild(panel)

    this.createColorSelector()
    this.createCustomColor()
  }
  set trigger(trigger: HTMLElement) {
    this._trigger = trigger
    this.innerHTML = ''
    this.appendChild(trigger)
  }
  set color(color: string) {
    this._color = color
    this.style.setProperty('--color', this._color)
  }
  get color() {
    return this._color
  }
  createColorSelector() {
    const colorSelector = document.createElement('div')
    colorSelector.className = 'custom-color-selector'
    this._colorSelector = colorSelector
    this._panel!.appendChild(colorSelector)

    const colorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const colorItem = target.closest('.custom-color-item') as HTMLElement
      if (!colorItem) return
      this._hexColor = colorItem.dataset.color!
      this.updateColor()
      this.close()
    }

    const colorGrid = document.createElement('div')
    colorGrid.className = 'custom-color-grid'
    this.createColorList(colorGrid, defaultColor)
    colorGrid.addEventListener('click', colorClick)
    colorSelector.appendChild(colorGrid)

    const customList = document.createElement('div')
    customList.className = 'custom-color-list'
    colorSelector.appendChild(customList)

    this.createColorList(customList, customColorList)
    customList.addEventListener('click', colorClick)

    const contextMenu = document.createElement('ul')
    contextMenu.className = 'custom-color-list-contextmenu'
    this._contextMenu = contextMenu
    customList.appendChild(contextMenu)

    const delBtn = document.createElement('li')
    delBtn.className = 'custom-color-contextmenu_item'
    delBtn.innerHTML = '删除'
    contextMenu.appendChild(delBtn)

    delBtn.addEventListener('click', () => {
      this._contextMenu!.style.display = 'none'
      const hex = this._contextColor!.dataset.color!
      const index = customColorList.indexOf(hex)
      customColorList.splice(index, 1)
      localStorage.setItem('customColorList', JSON.stringify(customColorList))
      this._contextColor?.remove()
      this._contextColor = undefined
    })

    customList.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault()
      const target = e.target as HTMLElement
      const colorItem = target.closest('.custom-color-item') as HTMLElement
      if (colorItem) {
        this._contextColor = colorItem
        const rect = colorItem.getBoundingClientRect()
        contextMenu.style.left = `${rect.left}px`
        contextMenu.style.top = `${rect.bottom}px`
        contextMenu.style.display = 'block'
      }
    })

    const addBtn = createIcon('add')
    addBtn.addEventListener('click', () => {
      this._colorSelector!.style.display = 'none'
      this._customColor!.style.display = 'block'
      this.updateCustomColor()
    })
    customList.appendChild(addBtn)

    const label = document.createElement('div')
    label.textContent = '透明度'
    colorSelector.appendChild(label)

    const percentSlider = new PercentSlider({value: this._alpha, className: 'alpha-slider'})
    percentSlider.addEventListener('change', (e: Event) => {
      this._alpha = (e as CustomEvent).detail
      this.updateColor()
    })
    this._alphaSlider = percentSlider
    colorSelector.appendChild(percentSlider)
  }
  createColorList(parent: HTMLElement, list: string[]) {
    list.forEach(color => {
      const colorItem = document.createElement('span')
      colorItem.className = 'custom-color-item'
      if (color2hexa(color)?.hex.toLowerCase() === '#ffffff') {
        colorItem.classList.add('border')
      }
      colorItem.style.color = color
      colorItem.dataset.color = color
      parent.appendChild(colorItem)
    })
  }
  createCustomColor() {
    const customColor = document.createElement('div')
    customColor.className = 'custom-color-custom'
    customColor.innerHTML = `
			<div class="custom-color-custom-panel">
				<div class="custom-color-custom-svpanel">
					<div class="svpanel_white"></div>
					<div class="svpanel_black"></div>
					<div class="svpanel_cursor"></div>
				</div>
			</div>
			<div class="custom-color-custom-preview">
				<div class="custom-color-custom-preview_color"></div>
				<div class="custom-color-custom-preview_input">
					<span>#</span>
					<input class="custom-color-custom-input" />
				</div>
				<button class="custom-button custom-button-primary">添加</button>
			</div>
		`

    this._svpanel = customColor.querySelector('.custom-color-custom-svpanel') as HTMLElement
    this._svpanel.addEventListener('mousedown', this.svpanelMousedown)

    this._cursor = customColor.querySelector('.svpanel_cursor') as HTMLElement
    this._preview = customColor.querySelector('.custom-color-custom-preview_color') as HTMLElement
    this._colorInput = customColor.querySelector('.custom-color-custom-input') as HTMLInputElement
    this._colorInput.addEventListener('input', (e: Event) => {
      let value = (e.target as HTMLInputElement).value
      value = value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
      ;(e.target! as HTMLInputElement).value = value
      if (value.length < 6) return
      this._hexColor = '#' + value
      this.updateCustomColor()
    })
    this._colorInput.addEventListener('change', e => e.stopPropagation())

    const addBtn = customColor.querySelector('button')
    addBtn!.addEventListener('click', this.addCustomColor.bind(this))

    const slider = new Slider({max: 360, direction: SliderDirection.VERTICAL})
    slider!.addEventListener('change', (e: Event) => {
      this._hsv!.h = (e as CustomEvent).detail
      this._hexColor = rgb2hex(hsv2rgb(this._hsv!))
      this._svpanel!.style.backgroundColor = `hsl(${this._hsv!.h}, 100%, 50%)`
      this.updateColor()
    })
    customColor.querySelector('.custom-color-custom-panel')!.appendChild(slider)

    this._customColor = customColor
    this._panel!.appendChild(customColor)
  }
  addCustomColor() {
    const isExist = customColorList.find(color => color === this._hexColor)
    if (!isExist) {
      customColorList.push(this._hexColor)
      localStorage.setItem('customColorList', JSON.stringify(customColorList))
      const addBtn = this._colorSelector!.querySelector('.custom-icon-add')
      const colorItem = document.createElement('span')
      colorItem.className = 'custom-color-item'
      if (this._hexColor.toLowerCase() === '#ffffff') {
        colorItem.classList.add('border')
      }
      colorItem.style.color = this._hexColor
      colorItem.dataset.color = this._hexColor
      addBtn?.insertAdjacentElement('beforebegin', colorItem)
    }
    this.updateColorSelected()
    this._colorSelector!.style.display = 'block'
    this._customColor!.style.display = 'none'
  }
  updateCustomColor() {
    this._preview!.style.backgroundColor = this._hexColor
    this._colorInput!.value = this._hexColor.slice(1)
    this._hsv = rgb2hsv(hex2rgb(this._hexColor)!)
    const rect = this._svpanel!.getBoundingClientRect()
    const left = (this._hsv.s / 100) * rect.width
    const top = (1 - this._hsv.v / 100) * rect.height
    this._cursor!.style.left = left + 'px'
    this._cursor!.style.top = top + 'px'
    this._svpanel!.style.backgroundColor = `hsl(${this._hsv.h}, 100%, 50%)`
    const sliderBar = this._customColor!.querySelector('slider-bar') as Slider
    sliderBar.setValue(this._hsv.h)
  }
  svpanelMousedown = (e: MouseEvent) => {
    const onMouseMove = (e: MouseEvent) => {
      const rect = this._svpanel!.getBoundingClientRect()
      let left = e.clientX - rect.left
      let top = e.clientY - rect.top
      left = Math.min(Math.max(0, left), rect.width)
      top = Math.min(Math.max(0, top), rect.height)
      this._cursor!.style.left = left + 'px'
      this._cursor!.style.top = top + 'px'
      this._hsv!.s = Math.round((left / rect.width) * 100)
      this._hsv!.v = Math.round((1 - top / rect.height) * 100)
      this._hexColor = rgb2hex(hsv2rgb(this._hsv!))
      this.updateColor()
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    onMouseMove(e)
    document!.addEventListener('mousemove', onMouseMove)
    document!.addEventListener('mouseup', onMouseUp)
  }

  updateColor() {
    const a = this._alpha / 100
    const alpha = Math.round(255 * a)
      .toString(16)
      .padStart(2, '0')
    this._preview!.style.backgroundColor = this._hexColor
    this._colorInput!.value = this._hexColor.slice(1)
    this._color = this._hexColor + alpha
    this._panel!.style.setProperty('--hex-color', this._hexColor)
    this.style.setProperty('--color', this._color)
    this.dispatchEvent(new CustomEvent('change', {detail: this._color}))
  }
  open() {
    if (this._isOpen) return
    this._isOpen = true
    const {hex, alpha} = color2hexa(this._color)

    this._alpha = alpha || 100
    this._hexColor = hex

    this._alphaSlider!.value = this._alpha
    this._panel!.style.setProperty('--hex-color', this._hexColor)
    this._panel.style.zIndex = ZIndexManager.next()
    this.layoutPanel()
    this.updateColorSelected()
    document.addEventListener('mousedown', this.handleDocClick)
  }
  close() {
    if (!this._isOpen) return
    this._contextMenu!.style.display = 'none'
    this._isOpen = false
    this._panel!.style.display = 'none'
    document.removeEventListener('mousedown', this.handleDocClick)
  }
  handleDocClick = (e: Event) => {
    const target = e.target as Node
    if (!this._contextMenu?.contains(target)) {
      this._contextMenu!.style.display = 'none'
    }
    if (!this._panel?.contains(target) && !this._trigger?.contains(target)) {
      this.close()
    }
  }
  layoutPanel() {
    this._panel!.style.display = 'block'
    this._colorSelector!.style.display = 'block'
    this._customColor!.style.display = 'none'

    const rect = this._trigger!.getBoundingClientRect()
    const bottomHeight = window.innerHeight - rect.bottom - 8
    const panelHeight = this._panel!.offsetHeight
    this._panel!.style.left = rect.left + 'px'
    if (rect.left + this._panel!.offsetWidth > window.innerWidth) {
      this._panel!.style.left = rect.right - this._panel!.offsetWidth + 'px'
    }

    if (bottomHeight >= panelHeight) this._panel!.style.top = rect.bottom + window.scrollY + 8 + 'px'
    else this._panel!.style.top = rect.top - panelHeight + window.scrollY - 8 + 'px'
  }
  updateColorSelected() {
    const items = this._colorSelector!.querySelectorAll('.custom-color-item')
    items.forEach(item => {
      const itemEl = item as HTMLElement
      if (itemEl.dataset.color === this._hexColor) {
        itemEl.classList.add('selected')
      } else itemEl.classList.remove('selected')
    })
  }
}
customElements.define('color-picker', ColorPicker)
