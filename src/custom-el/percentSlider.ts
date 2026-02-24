import {Slider} from './slider'

export class PercentSlider extends HTMLElement {
  private _value: number = 100
  private _inputEl: HTMLInputElement
  private _sliderBar: Slider
  constructor(options?: {value?: number; className?: string}) {
    super()
    const {value = 100, className} = options || {}
    this._value = value

    this.classList.add('custom-percent-slider')
    if (className) this.classList.add(className)

    const slider = new Slider({value})
    slider.addEventListener('change', (e: Event) => {
      this.setValue((e as CustomEvent).detail)
    })
    slider.value = this._value
    this._sliderBar = slider
    this.appendChild(slider)

    const inputContainer = document.createElement('div')
    const input = document.createElement('input')
    input.value = this._value.toString()
    inputContainer.className = 'custom-percent-slider-input'
    inputContainer.appendChild(input)
    this._inputEl = input
    input.addEventListener('input', (e: Event) => {
      e.stopPropagation()
      let value = (e.target as HTMLInputElement).value
      value = value.replace(/[^\d]/g, '')
      const num = Math.min(100, Math.max(0, Number(value)))
      this._inputEl!.value = num.toString()
    })
    input.addEventListener('change', e => {
      e.stopPropagation()
      const val = Number(input.value)
      slider.setValue(val)
    })

    const text = document.createElement('span')
    text.innerText = '%'
    inputContainer.appendChild(text)
    this.appendChild(inputContainer)
  }
  set value(value: number) {
    this._value = value
    this._sliderBar.value = value
    this._inputEl.value = value.toString()
  }
  setValue(value: number) {
    this._value = value
    this._inputEl!.value = value.toString()
    this.dispatchEvent(new CustomEvent('change', {detail: this._value}))
  }
}
customElements.define('percent-slider', PercentSlider)
