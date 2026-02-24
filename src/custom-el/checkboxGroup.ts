import {Checkbox} from './checkbox'

export interface CheckboxItem {
  value: string | number
  label: string
  disabled?: boolean
}
export class CheckboxGroup extends HTMLElement {
  private _checkboxList: Checkbox[] = []
  private _items: CheckboxItem[] = []
  private _value: (string | number)[]
  constructor(options?: {items?: CheckboxItem[]; className?: string; value?: (string | number)[]}) {
    super()
    const {items, className, value = []} = options || {}
    this._value = value
    this.classList.add('custom-checkbox-group')
    if (className) this.classList.add(className)
    if (items) this.items = items

    this.addEventListener('change', e => {
      const checkbox = (e.target as HTMLElement).closest('custom-checkbox') as Checkbox
      const value = checkbox.value!
      if (checkbox.checked) {
        this._value.push(value)
        this._value = [...new Set(this._value)]
      } else {
        const index = this._value.indexOf(value)
        if (index !== -1) this._value.splice(index, 1)
      }
    })
  }
  set items(items: CheckboxItem[]) {
    this._items = items
    this.filterValue()
    this.innerHTML = ''
    this._items.forEach(item => {
      const checkbox = new Checkbox({
        checked: this._value.includes(item.value),
        label: item.label,
        disabled: item.disabled,
        value: item.value
      })
      checkbox.classList.add('custom-checkboxgroup-item')
      this.appendChild(checkbox)
      this._checkboxList.push(checkbox)
    })
  }
  set value(value: (string | number)[]) {
    this._value = value
    this.filterValue()
    this._checkboxList.forEach(checkbox => {
      checkbox.checked = this._value.includes(checkbox.value!)
    })
  }
  get value(): (string | number)[] {
    return this._value
  }
  filterValue() {
    const valueList = this._items.map(item => item.value)
    this._value = this._value.filter(value => valueList.includes(value))
  }
}
customElements.define('checkbox-group', CheckboxGroup)
