import {CloseType, ZIndexManager} from './define'
import {createIcon} from './icon'

export enum DrawerDirection {
  rtl = 'rtl',
  ltr = 'ltr'
}
interface DrawerParams {
  title?: string
  showModal?: boolean
  cancelTxt?: string
  confirmTxt?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  className?: string
  direction?: DrawerDirection
  showCancel?: boolean
  showConfirm?: boolean
  beforeClose?: (type: CloseType, done: () => void) => void
}

export class Drawer extends HTMLElement {
  private _drawer: HTMLElement
  private _body: HTMLElement
  private _titleEl: HTMLElement
  private _footer: HTMLElement | null = null
  private _showCancel: boolean = false
  private _showConfirm: boolean = false
  beforeClose?: (type: CloseType, done: () => void) => void
  constructor(params?: DrawerParams) {
    const {
      title = '',
      showModal = false,
      cancelTxt = '取消',
      confirmTxt = '确定',
      closeOnClickModal = true,
      closeOnPressEscape = true,
      className,
      direction = DrawerDirection.rtl,
      showCancel = false,
      showConfirm = false,
      beforeClose
    } = params || {}
    super()

    this._showCancel = showCancel
    this._showConfirm = showConfirm
    this.beforeClose = beforeClose

    this.className = 'custom-drawer-wrapper'
    this.classList.add(direction)
    this.style.backgroundColor = showModal ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
    this.style.display = 'none'
    this!.addEventListener('click', () => {
      if (closeOnClickModal) this.close(CloseType.MODAL)
    })
    document.body.appendChild(this)

    this.innerHTML = `
			<div class="custom-drawer${className ? ' ' + className : ''}">
				<div class="custom-drawer-header">
					<span class="custom-drawer-header_title"></span>
					<span class="custom-drawer-close"></span>
				</div>
				<div class="custom-drawer-body"></div>
			</div>
		`

    this._drawer = this.querySelector('.custom-drawer')!
    this._drawer.addEventListener('click', e => e.stopPropagation())

    this._titleEl = this.querySelector('.custom-drawer-header_title')!
    if (title) this._titleEl.textContent = title

    const closeEl = this._drawer.querySelector('.custom-drawer-close')!
    closeEl.appendChild(createIcon('close'))
    closeEl.addEventListener('mousedown', e => e.stopPropagation())
    closeEl.addEventListener('click', () => this.close(CloseType.CLOSE))

    this._body = this.querySelector('.custom-drawer-body')!

    if (this._showCancel || this._showConfirm) {
      const footer = document.createElement('div')
      footer.className = 'custom-drawer-footer'
      this._footer = footer
      this._drawer.appendChild(footer)

      if (this._showCancel) {
        const cancelBtn = document.createElement('button')
        cancelBtn.className = 'custom-button btn-cancel'
        cancelBtn.textContent = cancelTxt
        cancelBtn.addEventListener('click', () => this.close(CloseType.CANCEL))
        footer.appendChild(cancelBtn)
      }

      if (this._showConfirm) {
        const confirmBtn = document.createElement('button')
        confirmBtn.className = 'custom-button btn-confirm'
        confirmBtn.textContent = confirmTxt
        confirmBtn.addEventListener('click', () => this.close(CloseType.CONFIRM))
        footer.appendChild(confirmBtn)
      }
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && closeOnPressEscape) this.close(CloseType.ESC)
    })
  }
  get body() {
    return this._body
  }
  open(options?: {title?: string; cancelTxt?: string; confirmTxt?: string}) {
    this.style.display = 'block'
    requestAnimationFrame(() => this._drawer.classList.add('show'))
    this.style.zIndex = ZIndexManager.next()
    if (options?.title) this._titleEl.textContent = options.title
    if (options?.cancelTxt && this._showCancel) {
      const cancelBtn = this._footer!.querySelector('.btn-cancel')!
      cancelBtn.textContent = options.cancelTxt
    }
    if (options?.confirmTxt && this._showConfirm) {
      const confirmBtn = this._footer!.querySelector('.btn-confirm')!
      confirmBtn.textContent = options.confirmTxt
    }
  }
  close(type: CloseType = CloseType.CLOSE) {
    if (this.beforeClose) this.beforeClose(type, this.closeDrawer.bind(this))
    else this.closeDrawer()
  }
  closeDrawer() {
    this._drawer.classList.remove('show')
    this._drawer.addEventListener('transitionend', () => (this.style.display = 'none'), {
      once: true
    })
  }
}
customElements.define('custom-drawer', Drawer)
