import {CloseType, ZIndexManager} from './define'
import {createIcon} from './icon'

enum MoveType {
  LeftTop = 0,
  Top,
  RightTop,
  Right,
  RightBottom,
  Bottom,
  LeftBottom,
  Left
}

interface ResizeConfig {
  cursor: string
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  width?: string
  height?: string
}
interface DialogParams {
  title?: string
  showModal?: boolean
  resizable?: boolean
  cancelTxt?: string
  confirmTxt?: string
  movable?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  className?: string
  width?: string
  beforeClose?: (type: CloseType, done: () => void) => void
}

export class Dialog extends HTMLElement {
  private _dialog: HTMLElement
  private _header: HTMLElement
  private _titleEl: HTMLElement
  private _body: HTMLElement
  private _footer: HTMLElement
  beforeClose?: (type: CloseType, done: () => void) => void
  constructor(params?: DialogParams) {
    const {
      showModal = true,
      resizable,
      movable = true,
      closeOnClickModal = true,
      closeOnPressEscape = true,
      className,
      title,
      cancelTxt = '取消',
      confirmTxt = '确定',
      width = '50%',
      beforeClose
    } = params || {}
    super()
    this.beforeClose = beforeClose

    this.className = 'custom-dialog-wrapper'
    this.style.backgroundColor = showModal ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
    this.style.display = 'none'
    this!.addEventListener('click', () => {
      if (closeOnClickModal) this.close(CloseType.MODAL)
    })
    document.body.appendChild(this)

    this.innerHTML = `
			<div class="custom-dialog${className ? ' ' + className : ''}">
				<div class="custom-dialog-header">
					<span class="custom-dialog-header_title"></span>
					<span class="custom-dialog-close"></span>
				</div>
				<div class="custom-dialog-body"></div>
				<div class="custom-dialog-footer">
					<div class="custom-dialog-footer_right">
						<button class="custom-button btn-cancel">${cancelTxt}</button>
						<button class="custom-button btn-confirm custom-button-primary">${confirmTxt}</button>
					</div>
				</div>
			</div>
		`

    // 容器
    this._dialog = this.querySelector('.custom-dialog')!
    this._dialog.style.width = width
    this._dialog.addEventListener('click', e => e.stopPropagation())

    // 头部
    this._header = this._dialog.querySelector('.custom-dialog-header')!
    if (movable) this.addMove()

    this._titleEl = this._header.querySelector('.custom-dialog-header_title')!
    if (title) this._titleEl.textContent = title

    const closeEl = this._dialog.querySelector('.custom-dialog-close')!
    closeEl.appendChild(createIcon('close'))
    closeEl.addEventListener('mousedown', e => e.stopPropagation())
    closeEl.addEventListener('click', () => this.close(CloseType.CLOSE))

    // 内容区域
    this._body = this._dialog.querySelector('.custom-dialog-body')!

    // 底部
    this._footer = this._dialog.querySelector('.custom-dialog-footer')!

    const cancelBtn = this._footer.querySelector('.btn-cancel')!
    cancelBtn.addEventListener('click', () => this.close(CloseType.CANCEL))

    const confirmBtn = this._footer.querySelector('.btn-confirm')!
    confirmBtn.addEventListener('click', () => this.close(CloseType.CONFIRM))

    // 创建缩放元素
    if (resizable) this.addResize()

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && closeOnPressEscape) this.close(CloseType.ESC)
    })
  }
  get body() {
    return this._body
  }

  addMove() {
    this._header.style.cursor = 'move'
    this._header.onmousedown = e => {
      const rect = this._dialog.getBoundingClientRect()
      const originX = e.clientX
      const originY = e.clientY

      const left = rect.left
      const top = rect.top

      let newLeft = left
      let newTop = top
      document.onselectstart = () => false
      document.onmousemove = e => {
        const offsetX = e.clientX - originX
        const offsetY = e.clientY - originY

        newLeft = Math.min(Math.max(left + offsetX, -this._header.offsetWidth + 40), window.innerWidth - 40)
        newTop = Math.min(Math.max(top + offsetY, 0), window.innerHeight - 40)

        this._dialog.style.left = newLeft + 'px'
        this._dialog.style.top = newTop + 'px'
      }
      document.onmouseup = () => {
        document.onselectstart = null
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
  addResize() {
    const parentBox = this._dialog
    const operateBox = document.createElement('div')
    operateBox.className = 'operate-box'
    parentBox.appendChild(operateBox)

    const createDiv = (type: MoveType, styles: ResizeConfig) => {
      const div = document.createElement('div')
      div.style.cssText = 'position:absolute;z-index:5'
      Object.keys(styles).forEach(key => ((div.style as any)[key] = styles[key as keyof ResizeConfig]))

      div.onmousedown = e => {
        const {left, top} = parentBox.getBoundingClientRect()
        const originX = e.clientX
        const originY = e.clientY
        const originHeight = parentBox.offsetHeight
        const originWidth = parentBox.offsetWidth
        const originLeft = left
        const originTop = top

        document.onselectstart = () => false
        document.onmousemove = e => {
          const offsetX = e.clientX - originX
          let offsetY = e.clientY - originY
          if ([MoveType.RightTop, MoveType.Right, MoveType.RightBottom].includes(type)) {
            if (originWidth + offsetX < 240) return
            parentBox.style.width = originWidth + offsetX + 'px'
          }

          if ([MoveType.RightBottom, MoveType.Bottom, MoveType.LeftBottom].includes(type)) {
            if (originHeight + offsetY < 160) return
            parentBox.style.height = originHeight + offsetY + 'px'
          }

          if ([MoveType.LeftTop, MoveType.LeftBottom, MoveType.Left].includes(type)) {
            if (originWidth - offsetX < 240) return
            parentBox.style.width = originWidth - offsetX + 'px'
            parentBox.style.left = originLeft + offsetX + 'px'
          }
          if ([MoveType.LeftTop, MoveType.Top, MoveType.RightTop].includes(type)) {
            if (originHeight - offsetY < 160) return
            if (originTop + offsetY < 0) offsetY = -originTop
            parentBox.style.height = originHeight - offsetY + 'px'
            parentBox.style.top = originTop + offsetY + 'px'
          }
        }
        document.onmouseup = function () {
          document.onselectstart = null
          document.onmousemove = null
          document.onmouseup = null
        }
      }
      operateBox.appendChild(div)
    }

    createDiv(MoveType.LeftTop, {
      cursor: 'nwse-resize',
      top: 0,
      left: 0,
      width: '10px',
      height: '10px'
    })
    createDiv(MoveType.Top, {
      cursor: 'ns-resize',
      top: 0,
      left: '10px',
      right: '10px',
      height: '5px'
    })
    createDiv(MoveType.RightTop, {
      cursor: 'nesw-resize',
      top: 0,
      right: 0,
      width: '10px',
      height: '10px'
    })
    createDiv(MoveType.Right, {
      cursor: 'ew-resize',
      top: '10px',
      right: 0,
      bottom: '10px',
      width: '5px'
    })
    createDiv(MoveType.RightBottom, {
      cursor: 'nwse-resize',
      bottom: 0,
      right: 0,
      width: '10px',
      height: '10px'
    })
    createDiv(MoveType.Bottom, {
      cursor: 'ns-resize',
      bottom: 0,
      left: '10px',
      right: '10px',
      height: '5px'
    })
    createDiv(MoveType.LeftBottom, {
      cursor: 'nesw-resize',
      bottom: 0,
      left: 0,
      width: '10px',
      height: '10px'
    })
    createDiv(MoveType.Left, {
      cursor: 'ew-resize',
      top: '10px',
      left: 0,
      bottom: '10px',
      width: '5px'
    })
  }
  open(options?: {title?: string; cancelTxt?: string; confirmTxt?: string; top?: string}) {
    this.style.display = 'block'
    this.style.zIndex = ZIndexManager.next()
    if (options?.title) this._titleEl.textContent = options.title
    if (options?.cancelTxt) {
      const cancelBtn = this._footer.querySelector('.btn-cancel')!
      cancelBtn.textContent = options.cancelTxt
    }
    if (options?.confirmTxt) {
      const confirmBtn = this._footer.querySelector('.btn-confirm')!
      confirmBtn.textContent = options.confirmTxt
    }
    const {width, height} = this._dialog.getBoundingClientRect()
    this._dialog.style.left = (window.innerWidth - width) / 2 + 'px'
    if (options?.top) this._dialog.style.top = options?.top
    else this._dialog.style.top = (window.innerHeight - height) / 2 + 'px'
  }
  close(type: CloseType = CloseType.CLOSE) {
    if (this.beforeClose) this.beforeClose(type, () => (this.style.display = 'none'))
    else this.style.display = 'none'
  }
}
customElements.define('custom-dialog', Dialog)
