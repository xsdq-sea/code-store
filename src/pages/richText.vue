<template>
  <div class="content" v-html="htmlStr"></div>
</template>
<script setup lang="ts">
const content =
  '<p>这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字</p><p><img src="https://img.trading.live/1d9cfe/0d4978/a4c68dd72a2b4956b4c26a234721371d.png?w=800&h=800" alt="" data-href="" style=""/></p><p>这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字</p><p><img src="https://img.trading.live/1d9cfe/0d4978/90fc5265532e4c80b069088251bd0447.gif?w=800&h=600" alt="" data-href="" style=""/></p><p>这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字</p><p><img src="https://img.trading.live/1d9cfe/0d4978/38b2c06e5249474c960d4d89016f6ec5.webp?w=300&h=300" alt="" data-href="" style=""/></p><p>这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字</p><p><img src="https://img.trading.live/1d9cfe/0d4978/67ab2fe9af834a16bfe14b09c2a92ed6.gif" alt="" data-href="" style=""/></p><p>这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字</p>'
const htmlStr = computed(() => {
  return content.replace(/<img\s*src="([^"]*?)"[^>]*>/g, (match, $1) => {
    const arr = $1.split('?')
    const isGif = arr[0].endsWith('.gif')
    const w = getUrlParam(arr[1], 'w')
    const h = getUrlParam(arr[1], 'h')
    const percent = w && h ? (h / w) * 100 : 0
    let style = percent ? `padding-bottom: ${percent}%` : 'height: auto'
    let html = `<div class="img-box" style="width: ${w ? w + 'px' : 'auto'};">
      <div class="img-wrap" style="${style}">
      ${match}
    `
    if (isGif) html += `<div class="gif">GIF</div>`
    html += `</div></div>`
    return html
  })
})
const getUrlParam = (paramsStr: string, params: string) => {
  if (!paramsStr) return false
  var reg = new RegExp('(^|&)' + params + '=([^&]*)(&|$)')
  const result = paramsStr.match(reg)?.[2]
  if (result) return Number(result)
}
</script>
<style lang="less" scoped>
.content {
  max-width: 1000px;
  width: 100%;
  :deep(.img-box) {
    max-width: 100%;
    margin: 16px auto;
    text-align: center;
    .img-wrap {
      position: relative;
      height: 0;
      display: inline-block;
      img {
        max-width: 100%;
        vertical-align: middle;
      }
      .gif {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 2px 8px;
        font-size: 12px;
        color: white;
        background-color: rgba(0, 0, 0, 0.3);
        border-top-left-radius: 8px;
      }
    }
  }
}
</style>
