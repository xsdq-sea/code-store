import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/common.less'
import {createPinia} from 'pinia'

const pinia = createPinia()
const app = createApp(App).use(pinia).use(router)
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局监听
pinia.use(({store}) => {
  store.$subscribe(() => {
    console.log('state变了')
  })
  store.$onAction(() => {
    console.log('执行action了')
  })
})
