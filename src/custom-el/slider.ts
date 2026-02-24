export enum SliderDirection {
  HORIZONTAL,
  VERTICAL
}
export class Slider extends HTMLElement {
  private _range: boolean = false
  private _min: number = 0
  private _max: number = 100
  private _value: number | [number, number]
  private _step: number = 1
  private _direction: SliderDirection
  private _track: HTMLDivElement | null = null
  private _runway: HTMLDivElement | null = null
  private _thumb: HTMLDivElement | null = null
  private _thumb2: HTMLDivElement | null = null
  constructor(options?: {
    value?: number | [number, number]
    min?: number
    max?: number
    step?: number
    range?: boolean
    direction?: SliderDirection
    className?: string
  }) {
    super()
    const {value = 0, min = 0, max = 100, step = 1, range = false, direction, className} = options || {}
    if (value) this._value = value
    else if (range) this._value = [min, max]
    else this._value = min
    this._min = min
    this._max = max
    this._step = step
    this._range = range
    this._direction = direction || SliderDirection.HORIZONTAL

    this.classList.add('custom-slider')
    if (className) this.classList.add(className)
    if (this._direction === SliderDirection.VERTICAL) {
      this.classList.add('vertical')
    }

    const track = document.createElement('div')
    track.className = 'custom-slider-track'
    this._track = track
    this.appendChild(track)

    const runway = document.createElement('div')
    runway.className = 'custom-slider-runway'
    this._runway = runway
    track.appendChild(runway)

    const thumb = document.createElement('div')
    thumb.className = 'custom-slider-thumb'
    this._thumb = thumb
    track.appendChild(thumb)
    thumb.addEventListener('mousedown', e => this.thumbMousedown(e, 1))

    if (this._range) {
      const thumb2 = document.createElement('div')
      thumb2.className = 'custom-slider-thumb thumb2'
      if (this._direction === SliderDirection.VERTICAL) {
        thumb2.style.top = '100%'
      } else thumb2.style.left = '100%'
      this._thumb2 = thumb2
      track.appendChild(thumb2)
      thumb2.addEventListener('mousedown', e => this.thumbMousedown(e, 2))
    }

    track.addEventListener('click', e => {
      if (e.target === this._thumb || e.target === this._thumb2) return
      const rect = track.getBoundingClientRect()
      let percent
      if (this._direction === SliderDirection.VERTICAL) {
        let top = e.clientY - rect.top
        top = Math.max(0, Math.min(rect.height, top))
        percent = 1 - top / rect.height
      } else {
        let left = e.clientX - rect.left
        left = Math.max(0, Math.min(rect.width, left))
        percent = left / rect.width
      }
      let clickValue = this._min + percent * (this._max - this._min)
      clickValue = Math.round(clickValue / this._step) * this._step

      if (this._range && Array.isArray(this._value)) {
        const [v1, v2] = this._value
        const dist1 = Math.abs(clickValue - v1)
        const dist2 = Math.abs(clickValue - v2)
        if (dist1 <= dist2) this.setValue([clickValue, v2])
        else this.setValue([v1, clickValue])
      } else this.setValue(clickValue)
    })

    this.updateUI()
  }
  set value(value: number | [number, number]) {
    if (!this._range) {
      value = Math.min(Math.max(value as number, this._min), this._max)
    } else {
      value = value as [number, number]
      value = [Math.min(Math.max(value[0], this._min), this._max), Math.min(Math.max(value[1], this._min), this._max)]
    }
    this._value = value
    this.updateUI()
  }
  set min(min: number) {
    if (min > this._max) this._max = min
    if (this._range) {
      const value = this._value as [number, number]
      if (value[0] < min) value[0] = min
      if (value[1] < min) value[1] = min
      this._value = value
    } else {
      if ((this._value as number) < min) this._value = min
    }

    this._min = min
    this.updateUI()
  }
  set max(max: number) {
    if (max < this._min) this._min = max
    if (this._range) {
      const value = this._value as [number, number]
      if (value[0] > max) value[0] = max
      if (value[1] > max) value[1] = max
      this._value = value
    } else {
      if ((this._value as number) > max) this._value = max
    }
    this._max = max
    this.updateUI()
  }
  set step(step: number) {
    this._step = step
    this.updateUI()
  }
  thumbMousedown(e: MouseEvent, index: number) {
    if (!this._range && index === 2) return
    e.preventDefault()
    if (this._range) {
      if (index === 1) {
        this._thumb!.style.zIndex = '2'
        this._thumb2!.style.zIndex = '1'
      } else {
        this._thumb!.style.zIndex = '1'
        this._thumb2!.style.zIndex = '2'
      }
    }
    const onMouseMove = (ev: MouseEvent) => {
      const rect = this._track!.getBoundingClientRect()
      if (this._direction === SliderDirection.VERTICAL) {
        let top = ev.clientY - rect.top
        top = Math.max(0, Math.min(rect.height, top))
        const percent = 1 - top / rect.height
        let value = this._min + percent * (this._max - this._min)
        value = Math.round(value / this._step) * this._step
        if (this._range) {
          const v = this._value as [number, number]
          const minVal = Math.min(v[0], v[1])
          const maxVal = Math.max(v[0], v[1])
          if (index === 1) {
            this.setValue([Math.min(value, maxVal), maxVal])
          } else {
            this.setValue([minVal, Math.max(value, minVal)])
          }
        } else this.setValue(value)
      } else {
        let left = ev.clientX - rect.left
        left = Math.max(0, Math.min(rect.width, left))
        const percent = left / rect.width
        let value = this._min + percent * (this._max - this._min)
        value = Math.round(value / this._step) * this._step
        if (this._range) {
          const v = this._value as [number, number]
          const minVal = Math.min(v[0], v[1])
          const maxVal = Math.max(v[0], v[1])
          if (index === 1) {
            this.setValue([Math.min(value, maxVal), maxVal])
          } else {
            this.setValue([minVal, Math.max(value, minVal)])
          }
        } else this.setValue(value)
      }
    }
    const onMouseUp = () => {
      this.dispatchEvent(new CustomEvent('change', {detail: this._value}))
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
  updateUI() {
    if (this._range && Array.isArray(this._value)) {
      const [v1, v2] = this._value
      const percent1 = ((v1 - this._min) / (this._max - this._min)) * 100
      const percent2 = ((v2 - this._min) / (this._max - this._min)) * 100
      if (this._direction === SliderDirection.VERTICAL) {
        // 垂直方向：从下往上显示，最小值在下面，最大值在上面
        const topPercent1 = 100 - percent1
        const topPercent2 = 100 - percent2
        this._thumb!.style.top = `${topPercent1}%`
        this._thumb2!.style.top = `${topPercent2}%`
        const minTopPercent = Math.min(topPercent1, topPercent2)
        const maxTopPercent = Math.max(topPercent1, topPercent2)
        this._runway!.style.top = `${minTopPercent}%`
        this._runway!.style.height = `${maxTopPercent - minTopPercent}%`
      } else {
        const minPercent = Math.min(percent1, percent2)
        const maxPercent = Math.max(percent1, percent2)
        if (v1 <= v2) {
          this._thumb!.style.left = `${percent1}%`
          this._thumb2!.style.left = `${percent2}%`
        } else {
          this._thumb!.style.left = `${percent2}%`
          this._thumb2!.style.left = `${percent1}%`
        }
        this._runway!.style.left = `${minPercent}%`
        this._runway!.style.width = `${maxPercent - minPercent}%`
      }
    } else if (!this._range && typeof this._value === 'number') {
      const percent = ((this._value - this._min) / (this._max - this._min)) * 100
      if (this._direction === SliderDirection.VERTICAL) {
        // 垂直方向：从下往上显示，最小值在下面，最大值在上面
        const topPercent = 100 - percent
        this._thumb!.style.top = `${topPercent}%`
        this._runway!.style.bottom = '0'
        this._runway!.style.height = `${percent}%`
      } else {
        this._thumb!.style.left = `${percent}%`
        this._runway!.style.left = '0'
        this._runway!.style.width = `${percent}%`
      }
    }
  }
  setValue(value: number | [number, number]) {
    let hasChanged = false
    if (this._range && Array.isArray(value)) {
      let [v1, v2] = value
      if (v1 > v2) [v1, v2] = [v2, v1]
      if (v1 < this._min) v1 = this._min
      if (v2 > this._max) v2 = this._max
      const currentValue = this._value as [number, number]
      if (v1 !== currentValue[0] || v2 !== currentValue[1]) {
        this._value = [v1, v2]
        hasChanged = true
      }
    } else if (!this._range && typeof value === 'number') {
      if (value < this._min) value = this._min
      if (value > this._max) value = this._max
      if (value !== this._value) {
        this._value = value
        hasChanged = true
      }
    }
    if (hasChanged) {
      this.updateUI()
      this.dispatchEvent(new CustomEvent('change', {detail: this._value}))
    }
  }
}

customElements.define('custom-slider', Slider)
