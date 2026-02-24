<template>
  <el-button @click="downloadWithForm" type="primary">使用form表单下载</el-button>
  <el-button @click="downloadWithA" type="primary">使用a标签下载</el-button>
</template>
<script setup lang="ts">
import axios from 'axios'

const downloadWithForm = () => {
  let form = document.createElement('form')
  form.style.display = 'none'
  form.setAttribute('target', '_self') // _blank
  form.setAttribute('method', 'get')
  form.setAttribute('action', '/api/admin/showData/advertise/export')

  // 需要传递的参数，可以使用input标签携带
  let index = document.createElement('input')
  index.setAttribute('type', 'hidden')
  index.setAttribute('name', 'index')
  index.setAttribute('value', '1')
  form.appendChild(index)

  let size = document.createElement('input')
  size.setAttribute('type', 'hidden')
  size.setAttribute('name', 'size')
  size.setAttribute('value', '10')
  form.appendChild(size)

  document.body.appendChild(form)
  form.submit()
}
const downloadWithA = () => {
  axios({
    url: '/api/admin/showData/advertise/export?index=1&size=10',
    method: 'get'
    // responseType: 'arraybuffer'
  }).then(res => {
    const blob = new Blob([res.data])
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '文件.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(a.href)
  })
}
</script>
