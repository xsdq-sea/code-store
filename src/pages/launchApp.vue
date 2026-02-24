<template>
  <el-button @click="openApp(3)">打开app</el-button>
</template>
<script setup lang="ts">
import * as webLaunchApp from 'web-launch-app'

const config = {
  scheme: 'forexchat://forexchat.com',
  launchType: {
    ios: 'scheme',
    android: 'scheme'
  },
  pkgs: {
    android: 'https://www.baidu.com', // 安卓下载地址
    ios: 'https://www.qq.com' // iOS下载地址
  },
  timeout: 3000,
  landPage: 'https://m.forexchat.com/forexchat/download' // 落地页
}

const {LaunchApp, inQQ, inWeibo, inWeixin, isAndroid, isIos, detector, locationCall} = webLaunchApp
const lanchApp = new LaunchApp(config)

const callback = (type: number) => (s: number) => {
  if (s === 1) return 1
  return type
}

const launchAppWithTagA = (url: string) => {
  const tagA = document.createElement('a')
  tagA.setAttribute('href', url)
  tagA.style.display = 'none'
  document.body.appendChild(tagA)
  tagA.click()
  setTimeout(() => {
    document.body.removeChild(tagA)
  }, 200)
}

const isAndroidFirefox = isAndroid && detector.browser.name === 'firefox'
const isAndroidQQ = isAndroid && detector.browser.name === 'qqbrowser'
const isAndroidUC = isAndroid && detector.browser.name === 'uc'
const isAndroidMi = isAndroid && detector.browser.name === 'mi'
const isChrome = (isAndroid || isIos) && detector.browser.name === 'chrome'

const ua = navigator.userAgent.toLowerCase()
const inLinkedin = ua.includes('linkedinapp')
let openApp = (type: number) => {}
if (inQQ || (inWeixin && isAndroid) || inWeibo || inLinkedin) {
  openApp = () => alert('请在浏览器中打开')
} else if (isAndroidFirefox || isAndroidQQ || isAndroidUC || isAndroidMi || isChrome) {
  lanchApp.options = {scheme: config.scheme}
  const _url = LaunchApp.openChannel.scheme.preOpen.call(lanchApp, config)
  openApp = type => {
    lanchApp.callback = callback(type)
    if (isChrome) launchAppWithTagA(_url)
    else locationCall(_url)
    lanchApp._setTimeEvent()
  }
} else openApp = (type: number) => lanchApp.open(config, callback(type))
</script>
