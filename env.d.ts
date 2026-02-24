/// <reference types="vite/client" />
declare interface Window {
  ws?: WebSocket
  parse?: any
}

declare interface ObjectConstructor {
  entries?: any
}

declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}
