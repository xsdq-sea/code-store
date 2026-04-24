import {createI18n} from 'vue-i18n'
import cn from './locales/cn.json5'
import en from './locales/en.json5'

const i18n = createI18n({
  fallbackLocale: 'en',
  locale: 'cn',
  messages: {cn, en}
})

export default i18n
