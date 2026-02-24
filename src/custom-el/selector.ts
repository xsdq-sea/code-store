import {ZIndexManager} from './define'
import {createIcon} from './icon'

export interface SelectorItem {
  value: number | string
  label: string | SVGSVGElement | HTMLElement
}

export class Selector extends HTMLElement {
  private _label: HTMLSpanElement | null = null
  private _list: HTMLUListElement | null = null
  private _isOpen: boolean = false
  private _items: SelectorItem[] = []
  private _value?: number | string | (number | string)[]
  private _multiple?: boolean
  constructor(options?: {
    items?: SelectorItem[]
    value?: string | number | (number | string)[]
    className?: string
    itemsClassName?: string
    multiple?: boolean
  }) {
    super()
    const {value, items, className, itemsClassName, multiple} = options || {}

    this._multiple = !!multiple
    if (this._multiple) this._value = Array.isArray(value) ? value : []
    else this._value = value

    this.classList.add('custom-selector')
    if (multiple) this.classList.add('multiple')
    if (className) this.classList.add(className)
    this.addEventListener('click', e => {
      e.stopPropagation()
      if (this._isOpen) this.close()
      else this.open()
    })

    const label = document.createElement('div')
    label.className = 'custom-selector-label'
    this._label = label
    this.appendChild(label)

    const icon = createIcon('arrow-down')
    icon.classList.add('custom-selector-icon')
    this.appendChild(icon)

    const list = document.createElement('ul')
    list.classList.add('custom-selector-list')
    if (multiple) list.classList.add('multiple')
    if (itemsClassName) list.classList.add(itemsClassName)
    list.addEventListener('click', e => {
      e.stopPropagation()
      const item = (e.target! as HTMLElement).closest('.custom-selector-item')
      if (item) {
        const index = Number((item as HTMLElement).dataset.index)
        this.select(this._items[index].value)
      }
    })
    list.style.display = 'none'
    this._list = list
    document.body.appendChild(list)

    if (items?.length) this.items = items
  }
  get value(): number | string | (number | string)[] | undefined {
    return this._value
  }
  set value(value: string | number | (number | string)[]) {
    this._value = value
    if (this._multiple) this.filterValue()
    this.updateUI()
  }
  set items(items: SelectorItem[]) {
    this._items = items
    if (this._multiple) this.filterValue()
    this._list!.innerHTML = ''
    const frag = document.createDocumentFragment()
    this._items.forEach(({label}, index) => {
      const li = document.createElement('li')
      li.className = 'custom-selector-item'
      li.setAttribute('data-index', String(index))
      if (label instanceof SVGSVGElement || label instanceof HTMLElement) {
        li.appendChild(label.cloneNode(true) as Node)
      } else li.textContent = String(label)

      if (this._multiple) {
        const icon = createIcon('select')
        li.appendChild(icon)
      }
      frag.appendChild(li)
    })
    this._list!.appendChild(frag)
    this.updateUI()
  }
  open() {
    this._isOpen = true
    this.classList.add('open')
    this._list!.style.display = 'block'
    this._list!.style.zIndex = ZIndexManager.next()
    if (this._list!.offsetWidth! < this.offsetWidth) {
      this._list!.style.width = this.offsetWidth + 'px'
    }
    this.updatePosition()
    document.addEventListener('mousedown', this.handleDocClick)
    window.addEventListener('resize', this.updatePosition)
  }
  close() {
    this._isOpen = false
    this.classList.remove('open')
    this._list!.style.display = 'none'
    document.removeEventListener('mousedown', this.handleDocClick)
    window.removeEventListener('resize', this.updatePosition)
  }
  handleDocClick = (e: Event) => {
    const target = e.target as Node
    if (!this._list?.contains(target) && !this.contains(target)) {
      this.close()
    }
  }
  select(value?: string | number) {
    if (this._multiple) {
      if (!Array.isArray(this._value)) return
      const index = this._value.indexOf(value!)
      if (index !== -1) this._value.splice(index, 1)
      else this._value.push(value!)
    } else {
      this.close()
      if (this._value === value) return
      this._value = value
    }
    this.updateUI()
    this.dispatchEvent(new CustomEvent('change', {detail: this._value}))
  }
  updateUI() {
    if (!this._items?.length) return
    const itemsEl = this._list?.querySelectorAll('li')
    if (this._multiple) {
      if (!Array.isArray(this._value)) return
      this._label!.innerHTML = ''
      ;(this._value as (number | string)[])?.forEach(value => {
        const option = this._items.find(item => item.value === value)
        if (!option) return

        // 创建tag
        const tag = document.createElement('span')
        tag.className = 'custom-selector-tag'
        if (option!.label instanceof SVGSVGElement || option!.label instanceof HTMLElement)
          tag.appendChild(option!.label.cloneNode(true) as Node)
        else tag.textContent = String(option!.label)

        const close = createIcon('close')
        close.addEventListener('click', e => {
          e.stopPropagation()
          this.select(value)
          this.updatePosition()
        })
        tag.appendChild(close)
        this._label!.appendChild(tag)
      })

      itemsEl?.forEach(item => {
        item.classList.remove('active')
        const index = Number(item.dataset.index)
        if ((this._value as (number | string)[])?.includes(this._items[index].value)) item.classList.add('active')
      })
      this.updatePosition()
    } else {
      const option = this._items.find(item => item.value === this._value)
      if (!option) return
      this._label!.innerHTML = ''
      if (option!.label instanceof SVGSVGElement || option!.label instanceof HTMLElement)
        this._label!.appendChild(option!.label.cloneNode(true) as Node)
      else this._label!.textContent = String(option!.label)

      itemsEl?.forEach(item => {
        item.classList.remove('active')
        const index = Number(item.dataset.index)
        if (this._items[index].value === this?._value) item.classList.add('active')
      })
    }
  }
  updatePosition = () => {
    const rect = this.getBoundingClientRect()
    const bottomHeight = window.innerHeight - rect.bottom - 8
    const listHeight = this._list!.offsetHeight
    this._list!.style.left = rect.left + 'px'

    if (bottomHeight >= listHeight) this._list!.style.top = rect.bottom + window.scrollY + 8 + 'px'
    else this._list!.style.top = rect.top - listHeight + window.scrollY - 8 + 'px'
  }
  filterValue() {
    const valueList = this._items.map(item => item.value)
    this._value = (this._value as (number | string)[]).filter(value => valueList.includes(value))
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this.handleDocClick)
    window.removeEventListener('resize', this.updatePosition)
    window.removeEventListener('scroll', this.updatePosition, true)
    if (this._list && this._list.parentNode) {
      this._list.parentNode.removeChild(this._list)
      this._list = null
    }
  }
}
customElements.define('custom-selector', Selector)
