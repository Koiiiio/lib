<<<<<<< HEAD
=======
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import jsQR from 'jsqr'
import { ElDialog, ElInput, ElButton } from 'element-plus'

const dialogVisible = ref(false)
const result = ref('')
const isAnimation = ref(true)
const audio = ref()
const video = ref(document.createElement('video'))
const cvsele = ref()
const canvas = ref()
const timer = ref()

const show = (val) => {
  dialogVisible.value = true
  result.value = val
  audio.value = new Audio('../assets/tone.mp3')
  cvsele.value = document.querySelector('canvas')
  canvas.value = cvsele.value.getContext('2d')
  canvas.value.clearRect(0, 0, cvsele.value.width, cvsele.value.height)
  cvsele.value.style.display = 'none'
}
const draw = (begin, end) => {
  this.canvas.beginPath()
  this.canvas.moveTo(begin.x, begin.y)
  this.canvas.lineTo(end.x, end.y)
  this.canvas.lineWidth = 3
  this.canvas.strokeStyle = 'red'
  this.canvas.stroke()
}

const sweep = () => {
  if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
    const { videoWidth, videoHeight } = this.video
    this.cvsele.width = videoWidth
    this.cvsele.height = videoHeight
    this.canvas.drawImage(this.video, 0, 0, videoWidth, videoHeight)
    try {
      const img = this.canvas.getImageData(0, 0, videoWidth, videoHeight)
      this.imgurl = img
      const obj = jsQR(img.data, img.width, img.height, {
        inversionAttempts: 'dontInvert'
      })
      if (obj) {
        const loc = obj.location
        this.draw(loc.topLeftCorner, loc.topRightCorner)
        this.draw(loc.topRightCorner, loc.bottomRightCorner)
        this.draw(loc.bottomRightCorner, loc.bottomLeftCorner)
        this.draw(loc.bottomLeftCorner, loc.topLeftCorner)
        if (this.result !== obj.data) {
          this.audio.play()
          this.result = obj.data
          this.isAnimation = false
          cancelAnimationFrame(this.timer)
          setTimeout(() => {
            this.cvsele.style.display = 'none'
          }, 1000)
        } else {
          console.log(this.result !== obj.data)
          alert('重复的二维码，请检查后重新扫描！')
        }
      }
      /*  else {
              console.error('识别失败，请检查二维码是否正确！0000')
            }*/
    } catch (err) {
      console.error('识别失败，请检查二维码是否正确！', err)
    }
  }
  if (this.isAnimation) {
    this.timer = requestAnimationFrame(() => {
      this.sweep()
    })
  }
}
const media = () => {
  this.isAnimation = true
  this.cvsele.style.display = 'block'
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'environment' }
      })
      .then((stream) => {
        this.video.srcObject = stream
        this.video.setAttribute('playsinline', true)
        this.video.setAttribute('webkit-playsinline', true)
        this.video.addEventListener('loadedmetadata', () => {
          this.video.play()
          this.sweep()
        })
      })
      .catch((error) => {
        console.error(
          error.name + '：' + error.message + '，' + error.constraint
        )
      })
  } else if (navigator.getUserMedia) {
    navigator.getUserMedia(
      {
        video: { facingMode: 'environment' }
      },
      (stream) => {
        this.video.srcObject = stream
        this.video.setAttribute('playsinline', true)
        this.video.setAttribute('webkit-playsinline', true)
        this.video.addEventListener('loadedmetadata', () => {
          this.video.play()
          this.sweep()
        })
      },
      (error) => {
        console.error(
          error.name + '：' + error.message + '，' + error.constraint
        )
      }
    )
  } else {
    if (
      navigator.userAgent.toLowerCase().match(/chrome/) &&
      location.origin.indexOf('https://') < 0
    ) {
      /* console.error(
              '获取浏览器录音功能，因安全性问题，需要在localhost 或 127.0.0.1 或 https 下才能获取权限！'
            )*/
      alert(
        '获取浏览器拍照/录音功能，因安全性问题，需要在https 下才能获取权限！'
      )
    } else {
      alert('对不起：未识别到扫描设备!')
    }
  }
}
const onConfirm = () => {
  if (this.result) {
    this.dialogVisible = false
    this.$emit('fromChild', this.result)
    this.closeCamera()
  } else {
    alert('请扫描二维码')
  }
}
// 关闭摄像头
const closeCamera = () => {
  const stream = this.video.srcObject
  if (stream) {
    console.log(stream, 'ppppppppppp')
    const tracks = stream.getTracks()
    tracks.forEach((track) => {
      track.stop()
    })
    this.video.srcObject = null
  }
}
onMounted(() => {
  // 可能需要处理的挂载逻辑
})

onUnmounted(() => {
  closeCamera()
})

watch(dialogVisible, (newValue) => {
  if (!newValue) closeCamera()
})
defineExpose({
  show
})
</script>
<template>
  <el-dialog
    title="扫描设备二维码"
    :visible="dialogVisible"
    width="40%"
    @close="closeCamera"
  >
    <main class="reader">
      <el-input
        v-model="result"
        style="width: 80%"
        type="textarea"
        :rows="2"
        placeholder="二维码识别结果"
      />
      <button class="sweep" @click="media()">扫一扫</button>
    </main>
    <canvas ref="canvas" class="canvas" />
    <span class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="onConfirm"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<style lang="less">
.reader {
  font-size: 16px;
  margin-bottom: 20px;
  .imgurl {
    margin: 20px;
    text-align: center;
    img {
      margin: 20px;
      padding: 10px;
      border: 1px solid gray;
      border-radius: 8px;
      width: 280px;
      height: 260px;
    }
  }
  .result {
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid gray;
    border-radius: 8px;
    font-size: 16px;
  }
}
.sweep {
  position: relative;
  padding: 12px;
  font-size: 18px;
  cursor: pointer;
  color: white;
  background: #42b983;
  border: 1px solid #42b983;
  overflow: hidden;
  input {
    position: absolute;
    font-size: 100px;
    opacity: 0;
  }
  .canvas {
    display: none;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 20px;
  }
}
</style>
>>>>>>> 68305bbf70e60f52cf95294c10bfd3df656d6fb4
