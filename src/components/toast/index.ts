import ToastVue from './toast.vue'
let toast: any
export default function Toast(msg: string, duration: number = 1500): void {
  if (!toast) {
    const div = document.createElement('div')
    toast = createApp(ToastVue).mount(div)
    document.body.appendChild(toast.$el)
  }
  toast.showMessage(msg, duration)
}
