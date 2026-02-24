<template>
  <div>
    <video ref="video" controls muted></video>
    <br />
    <img :src="imgUrl" />
  </div>
</template>
<script setup lang="ts">
const getVideoFirstFrame = (videoUrl: string) => {
  return new Promise(resolve => {
    const video = document.createElement('video')
    video.src = videoUrl
    video.currentTime = 0.05
    video.setAttribute('preload', 'auto')
    video.setAttribute('crossOrigin', 'anonymous')
    video.addEventListener('canplay', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height)
      // resolve(canvas.toDataURL())
      canvas.toBlob(b => resolve(URL.createObjectURL(b!)))
    })
  })
}

const imgUrl = ref('')
const video = ref<HTMLVideoElement | null>(null)
onMounted(() => {
  video.value!.src = '/video.mp4'
  getVideoFirstFrame('/video.mp4').then(url => {
    console.log(url)
    imgUrl.value = url as string
  })
})
</script>
<style lang="less" scoped>
img,
video {
  width: 400px;
}
</style>
