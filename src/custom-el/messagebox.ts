import {CloseType} from './define'
import {Dialog} from './dialog'

interface MessageBoxOptions {
  cancelTxt?: string
  confirmTxt?: string
  showModal?: boolean
  showCancel?: boolean
}
export class MessageBox {
  private static dialog: Dialog
  private static resolve: () => void
  private static reject: (type: CloseType) => void
  constructor() {
    throw new Error('this is static class')
  }

  static alert(msg: string, title?: string, options?: MessageBoxOptions): Promise<CloseType | void> {
    return this.confirm(msg, title, {...options, showCancel: false})
  }
  static confirm(msg: string, title?: string, options?: MessageBoxOptions): Promise<CloseType | void> {
    const {showCancel = true, showModal = true, cancelTxt, confirmTxt} = options || {}
    if (!this.dialog) {
      this.dialog = new Dialog({
        width: '400px',
        className: 'custom-messagebox-dialog',
        showModal,
        cancelTxt,
        confirmTxt,
        movable: false,
        closeOnClickModal: false,
        beforeClose: (type, done) => {
          if (type === CloseType.CONFIRM) this.resolve()
          else this.reject(type)
          done()
        }
      })
    }

    const cancelBtn = this.dialog.querySelector('.custom-dialog-footer_right .btn-cancel')! as HTMLElement
    if (showCancel) cancelBtn.style.display = 'block'
    else cancelBtn.style.display = 'none'

    this.dialog.body.innerHTML = msg
    this.dialog.open({title})

    return new Promise<CloseType | void>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}
