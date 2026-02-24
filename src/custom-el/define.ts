export enum CloseType {
  CLOSE = 'close', // 点击关闭按钮/modal/esc
  CANCEL = 'cancel', // 点击取消
  CONFIRM = 'confirm', // 点击确认
  ESC = 'esc', // 点击esc关闭
  MODAL = 'modal' // 点击遮罩关闭
}

export const ZIndexManager = {
  zIndex: 1000,
  next() {
    ZIndexManager.zIndex += 1
    return String(ZIndexManager.zIndex)
  }
}
