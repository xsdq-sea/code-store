interface ExtendedDocument extends Document {
  webkitCancelFullScreen?: any
  mozCancelFullScreen?: any
  msExitFullscreen?: any
}

interface ExtendedHTMLElement extends HTMLElement {
  webkitEnterFullscreen?: any
  webkitRequestFullScreen?: any
  mozRequestFullScreen?: any
  msRequestFullscreen?: any
}

let isFullScreen = false
let callback: (b: boolean) => void
const fullScreenChange = () => {
  isFullScreen = !!document.fullscreenElement
  callback(isFullScreen)
}
document.addEventListener('fullscreenchange', fullScreenChange)
document.addEventListener('mozfullscreenchange', fullScreenChange)
document.addEventListener('webkitfullscreenchange', fullScreenChange)
document.addEventListener('MSFullscreenChange', fullScreenChange)
export const fullScreen = (el: HTMLElement, cb: typeof callback) => {
  callback = cb
  if (!isFullScreen) requestFullScreen(el)
  else exitFullScreen()
}
const requestFullScreen = (element: HTMLElement) => {
  const e: ExtendedHTMLElement = element
  if (e.webkitEnterFullscreen) e.webkitEnterFullscreen()
  else if (e.requestFullscreen) e.requestFullscreen()
  else if (e.webkitRequestFullScreen) e.webkitRequestFullScreen()
  else if (e.mozRequestFullScreen) e.mozRequestFullScreen()
  else e.msRequestFullscreen()
}
const exitFullScreen = () => {
  const d: ExtendedDocument = document
  const requestMethod = d.exitFullscreen || d.webkitCancelFullScreen || d.mozCancelFullScreen || d.msExitFullscreen
  requestMethod.call(d)
}
