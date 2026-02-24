import {Radio} from './radio'

export interface RadioItem {
  label: string
  value: string | number
  disabled?: boolean
}

export class RadioGroup extends HTMLElement {
  private _radioList: Radio[] = []
  private _items: RadioItem[] = []
  private _value: string | number = ''
  constructor(options?: {items?: RadioItem[]; className?: string; value?: string | number}) {
    super()
    const {items, value = '', className} = options || {}
    this._value = value
    this.classList.add('custom-radio-group')
    if (className) this.classList.add(className)
    if (items) this.items = items

    this.addEventListener('change', e => {
      const radio = (e.target as HTMLElement).closest('custom-radio') as Radio
      this.value = radio.value!
    })
  }
  set items(items: RadioItem[]) {
    this._items = items
    this.innerHTML = ''
    this._items.forEach(item => {
      const radio = new Radio({
        checked: this._value === item.value,
        label: item.label,
        disabled: item.disabled,
        value: item.value
      })

      radio.classList.add('custom-radiogroup-item')
      this.appendChild(radio)
      this._radioList.push(radio)
    })
  }
  set value(value: string | number) {
    this._value = value
    this._radioList.forEach(radio => {
      radio.checked = this._value === radio.value
    })
  }

  get value() {
    return this._value
  }
}
customElements.define('radio-group', RadioGroup)
