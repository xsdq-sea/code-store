<template>
  <div class="box">
    <input type="file" @change="handleFileChange" />
    <div class="video">
      <div class="frame-position">
        <div class="time">{{ msToTime(currentTime) }}</div>
        <div ref="slider" class="slider"></div>
      </div>
      <video ref="video"></video>
    </div>
    <canvas ref="canvas" width="1920" height="1080"></canvas>
    <div class="btns">
      <button @click="play">播放</button>
      <button @click="pause">暂停</button>
      <button @click="exportVideo">导出</button>
      <button @click="cancelExport">取消</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useTemplateRef} from 'vue'
import {createFile, DataStream} from 'mp4box'

const video = useTemplateRef<HTMLVideoElement>('video')
const slider = useTemplateRef<HTMLDivElement>('slider')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
let ctx: CanvasRenderingContext2D | null = null

const currentTime = ref(0)
const duration = ref(0)
let file: File | null = null

onMounted(() => {
  ctx = canvas.value!.getContext('2d')!
  slider.value!.onmousedown = framePositionOnMouseDown
  video.value!.onseeked = () => {
    ctx!.drawImage(video.value!, 0, 0, canvas.value!.width, canvas.value!.height)
  }
  video.value!.onended = () => timer && clearInterval(timer)
  video.value!.requestVideoFrameCallback(updateProgressFrame)
})

const handleFileChange = (e: Event) => {
  file = (e.target as HTMLInputElement).files![0]
  video.value!.src = URL.createObjectURL(file)
  video.value!.preload = 'metadata'
  video.value!.onloadedmetadata = () => {
    duration.value = video.value!.duration
  }
}

function updateProgressFrame() {
  const time = video.value!.currentTime
  currentTime.value = time
  slider.value!.style.left = `${(time / duration.value) * video.value!.offsetWidth}px`
  video.value!.requestVideoFrameCallback(updateProgressFrame)
}

function framePositionOnMouseDown() {
  document.onselectstart = () => false
  document.onmousemove = (e: MouseEvent) => {
    const rect = video.value!.getBoundingClientRect()
    let left = e.clientX - rect.left
    left = Math.max(Math.min(left, video.value!.offsetWidth), 0)
    slider.value!.style.left = `${left}px`
    currentTime.value = (left / video.value!.offsetWidth) * duration.value
    video.value!.currentTime = currentTime.value
  }
  document.onmouseup = () => {
    document.onselectstart = null
    document.onmousemove = null
    document.onmouseup = null
  }
}

function msToTime(s: number) {
  if (!s) s = 0
  const ms = Math.round(s * 1000)
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = ms % 1000

  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  const msStr = String(milliseconds).padStart(3, '0')

  return `${mm}:${ss},${msStr}`
}

let timer: number | null
const play = async () => {
  if (!video.value!.src) return
  await video.value!.play()
  timer = setInterval(() => {
    ctx!.drawImage(video.value!, 0, 0, canvas.value!.width, canvas.value!.height)
  }, 16)
}

const pause = () => {
  timer && clearInterval(timer)
  video.value!.pause()
}

const exportVideo = async () => {
  isCancel = false
  console.time('exportVideo')
  videoToFrame(file!, 24, (frame, isLast) => {
    if (isLast) console.timeEnd('exportVideo')
    if (!frame) return
    currentTime.value = frame.timestamp / 1e6
    slider.value!.style.left = `${(currentTime.value / duration.value) * video.value!.offsetWidth}px`
    ctx!.drawImage(frame, 0, 0, canvas.value!.width, canvas.value!.height)
  })
}

let isCancel = false
const cancelExport = () => (isCancel = true)

async function videoToFrame(
  file: File,
  targetFps: number,
  callback: (frame: VideoFrame | null, isLast?: boolean) => void
) {
  let decoder: any = null
  let processingQueue = Promise.resolve()
  let pendingSamples = 0 // 待处理样本数
  let totalSamples = 0 // 总样本数
  let samplesReceived = 0 // 已接收样本数

  const mp4boxFile = createFile()
  mp4boxFile.onReady = (info: any) => {
    const videoTrack = info.videoTracks[0]
    if (!videoTrack) return
    totalSamples = videoTrack.nb_samples

    const trak = mp4boxFile.moov.traks.find((t: any) => t.tkhd.track_id === videoTrack.id)!
    const entry = trak.mdia.minf.stbl.stsd.entries[0] as any
    const box = entry.avcC || entry.hvcC || entry.vpcC
    if (!box) return console.error('视频格式不支持')

    let startTime = 0
    let lastFrame: VideoFrame | null = null
    let lastOutputFrameIndex = 0
    let frameInterval = 1000 / targetFps

    decoder = new VideoDecoder({
      output: (frame: VideoFrame) => {
        if (isCancel) {
          frame.close()
          decoder.close()
          decoder = null
          return
        }
        pendingSamples--
        const isLast = pendingSamples <= 0
        if (!startTime) startTime = performance.now()
        const timestampMs = frame.timestamp / 1000
        const expectedFrameIndex = Math.round(timestampMs / frameInterval)
        const framesToOutput = expectedFrameIndex - lastOutputFrameIndex
        if (framesToOutput < 0) {
          console.log('丢帧')
          isLast && callback(null, isLast)
          lastFrame?.close()
          return frame.close()
        }

        for (let i = 0; i < framesToOutput; i++) {
          console.log('补帧')
          if (!lastFrame) break
          const repeatFrame = new VideoFrame(lastFrame)
          callback(repeatFrame)
          repeatFrame.close()
          lastOutputFrameIndex++
        }
        callback(frame, isLast)
        lastFrame?.close()
        if (isLast) return frame.close()
        lastFrame = frame
        lastOutputFrameIndex++
      },
      error: (e: Error) => console.error('解码器报错:', e)
    })

    const stream = new DataStream(undefined, 0)
    box.write(stream)
    const description = new Uint8Array(stream.buffer, 8)
    decoder.configure({codec: videoTrack.codec, description})

    mp4boxFile.setExtractionOptions(videoTrack.id)
    mp4boxFile.start()
  }

  mp4boxFile.onSamples = (id, _user, samples) => {
    pendingSamples = samplesReceived += samples.length
    if (samplesReceived >= totalSamples) mp4boxFile.stop()

    processingQueue = processingQueue.then(async () => {
      for (const sample of samples) {
        while (decoder && decoder.decodeQueueSize > 30) {
          await new Promise(r => setTimeout(r, 0))
        }
        if (!decoder || isCancel) return mp4boxFile.releaseUsedSamples(id, sample.number)
        const timestamp = (sample.cts * 1000000) / sample.timescale
        const chunk = new EncodedVideoChunk({
          type: sample.is_sync ? 'key' : 'delta',
          timestamp,
          duration: (sample.duration * 1000000) / sample.timescale,
          data: sample.data!
        })
        decoder.decode(chunk)
        mp4boxFile.releaseUsedSamples(id, sample.number)
      }
    })
  }

  mp4boxFile.onError = e => console.error('MP4Box 解析错误:', e)

  // 开始读取文件
  const arrayBuffer = await file.arrayBuffer()
  ;(arrayBuffer as any).fileStart = 0
  mp4boxFile.appendBuffer(arrayBuffer as any)
  mp4boxFile.flush()

  await processingQueue
  await decoder?.flush()
  decoder?.close()
}
</script>
<style lang="less" scoped>
.box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  video {
    width: 100%;
    height: 100%;
    background-color: black;
    vertical-align: middle;
  }
  canvas {
    width: 500px;
    background-color: rgb(243, 241, 241);
  }
  .btns {
    display: flex;
    align-content: center;
    gap: 8px;
  }
}
.video {
  width: 130px;
  height: 73px;
  position: relative;
  background-color: red;
  .frame-position {
    .time {
      //   display: none;
      position: absolute;
      z-index: 1;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 10px;
      padding: 1px 4px;
    }

    .slider {
      position: absolute;
      left: 0;
      top: -12px;
      bottom: 0;
      width: 1px;
      border-radius: 50%;
      background-color: #00c0c8;

      &::after {
        content: '';
        cursor: pointer;
        position: absolute;
        border-top: 10px solid #00c0c8;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        top: 0;
        left: -6px;
      }
    }
  }
}
</style>
