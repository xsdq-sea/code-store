import {Slider} from './slider'

export class RangeSlider extends HTMLElement {
  private _value: [number, number] = [0, 100]
  private _input1: HTMLInputElement
  private _input2: HTMLInputElement
  private _min: number
  private _max: number
  private _slider: Slider
  constructor(options?: {value?: [number, number]; min?: number; max?: number; className?: string}) {
    super()
    const {value = [0, 100], min = 0, max = 100, className} = options || {}
    this._value = [Math.max(value[0], min), Math.min(value[1], max)]
    this._min = min
    this._max = max

    this.classList.add('custom-range-slider')
    if (className) this.classList.add(className)

    const slider = new Slider({
      range: true,
      value: [...this._value],
      min: min,
      max: max
    })
    slider.addEventListener('change', (e: Event) => {
      this.setValue((e as CustomEvent).detail)
    })
    this._slider = slider

    const input1 = document.createElement('input')
    input1.value = this._value[0].toString()
    input1.addEventListener('input', (e: Event) => this.numberInput(e))
    input1.addEventListener('change', e => this.numberChange(e, 1))
    this.appendChild(input1)
    this._input1 = input1

    this.appendChild(slider)

    const input2 = document.createElement('input')
    input2.value = this._value[1].toString()
    input2.addEventListener('input', (e: Event) => this.numberInput(e))
    input2.addEventListener('change', e => this.numberChange(e, 2))
    this._input2 = input2
    this.appendChild(input2)
  }
  set min(min: number) {
    this._min = min
    this._slider.min = min
    if (this._value[0] < min) this._value[0] = min
    this._input1.value = this._value[0].toString()
  }
  set max(max: number) {
    this._max = max
    this._slider.max = max
    if (this._value[1] > max) this._value[1] = max
    this._input2.value = this._value[1].toString()
  }
  set value(value: [number, number]) {
    this._value = [...value]
    this._input1.value = this._value[0].toString()
    this._input2.value = this._value[1].toString()
    this._slider.value = [...this._value]
  }
  numberInput(e: Event) {
    e.stopPropagation()
    let value = (e.target as HTMLInputElement).value
    value = value.replace(/[^\d]/g, '')
    const num = Math.min(this._max, Math.max(this._min, Number(value)))
    ;(e.target! as HTMLInputElement).value = num.toString()
  }
  numberChange(e: Event, index: number) {
    e.stopPropagation()
    let val = Number((e.target as HTMLInputElement).value)
    val = Math.min(this._max, Math.max(this._min, val))
    if (index === 1) {
      val = Math.min(val, this._value[1])
      this._value[0] = val
    } else {
      val = Math.max(val, this._value[0])
      this._value[1] = val
    }
    this._slider.setValue([...this._value])
  }

  setValue(value: [number, number]) {
    this._value = [...value]
    this._input1.value = this._value[0].toString()
    this._input2.value = this._value[1].toString()
    this.dispatchEvent(new CustomEvent('change', {detail: this._value}))
  }
}
customElements.define('range-slider', RangeSlider)
