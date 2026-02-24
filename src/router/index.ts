import {createRouter, createWebHistory} from 'vue-router'

const name: {[key: string]: string} = {
  '3dOverturn': '3d翻转',
  '3dRotate': '3d旋转',
  textEllipsis: '文字省略',
  carousel: '伪轮播',
  copy: '复制',
  downloadFile: '下载文件',
  dragSort: '拖拽排序',
  dragUpload: '拖拽上传',
  moveZoom: '移动缩放',
  moveTools: '可拖动工具栏',
  firstFrame: '视频第一帧',
  fullscreen: '元素全屏',
  img2blob: '图片转blob',
  insertStr: '字符串插入',
  launchApp: 'app唤起',
  loadHistory: '下拉加载历史',
  maxBalance: '最大余额法',
  readImg: '读取图片',
  round: '四舍五入',
  scrollBar: '滚动条样式',
  scrollWidth: '滚动条宽度',
  shake: '防抖节流',
  supportWebp: '是否支持webp',
  textScroll: '文字滚动',
  thousands: '千分位分隔',
  usePinia: '使用pinia',
  watermark: '添加水印',
  webComponent: 'Web Component',
  websocket: 'WebSocket',
  eventSource: 'EventSource',
  richText: '富文本图片占位',
  scrollFixed: '滚动上下锁定',
  inputAutoSize: '输入框自适应',
  infiniteScroll: '无限滚动',
  scrollList: '滚动列表',
  serviceWorker: 'Service Worker',
  communication: '标签页通信',
  sharedWorker: '共享线程',
  colorSelect: '颜色选择器',
  multiElLayout: '多元素布局',
  virtualScroll: '虚拟滚动',
  inertiaScroll: '惯性滚动',
  test: '测试一下'
}

const modules = import.meta.glob('../pages/*.vue') // pages下的所有vue文件
export const routes = Object.keys(modules).map(path => {
  const key = path.replace(/^\.\.\/pages\/(.*)\.vue$/, '$1')
  return {
    path: '/' + (key === 'test' ? '' : key),
    name: key,
    meta: {
      name: name[key]
    },
    component: modules[path]
  }
})

export default createRouter({
  history: createWebHistory(),
  routes
})
