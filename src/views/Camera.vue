<script>
import { BrowserMultiFormatReader } from '@zxing/library'
//import { Toast, Dialog, Notify, NavBar } from 'vant'
import BookEdit from './book/components/BookEdit.vue'
import Instance from './book/components/Instance.vue'
export default {
  name: 'ScanCodePage', // 扫码页面
  components: {
    BookEdit,
    Instance
  },
  data() {
    return {
      codeReader: null,
      tipShow: false, // 是否展示提示
      tipMsg: '', // 提示文本内容
      scanText: '', // 扫码结果文本内容
      addInfo: 0, // 0 入库实体  1 添加信息
      dialog1: null,
      dialog2: null
    }
  },
  created() {
    this.openScan()
  },
  watch: {
    $route(to, from) {
      if (to.path == '/ScanCodePage') {
        // 当处于该页面时
        this.openScan()
      }
    }
  },
  unmounted() {
    this.codeReader.reset()
    this.codeReader = null
  },
  methods: {
    async openScan() {
      // 初始化摄像头
      this.codeReader = await new BrowserMultiFormatReader()
      this.codeReader
        .getVideoInputDevices()
        .then((videoDevices) => {
          this.tipMsg = 'Accessing camera...'
          this.tipShow = true
          console.log('get-videoDevices', videoDevices)

          // 默认获取摄像头列表里的最后一个设备id，通过几部测试机发现一般前置摄像头位于列表里的前面几位，所以一般获取最后一个的是后置摄像头
          // let firstDeviceId = videoDevices[videoDevices.length - 1].deviceId
          //用第一个摄像头
          let firstDeviceId = videoDevices[0].deviceId
          // 一般获取了手机的摄像头列表里不止一个，有的手机摄像头高级多层，会有变焦摄像头等情况，需要做处理
          if (videoDevices.length > 1) {
            // 一般通过判断摄像头列表项里的 label 字段，'camera2 0, facing back' 字符串含有 'back' 和 '0'，大部分机型是这样，如果有些机型没有，那就还是默认获取最后一个
            firstDeviceId = videoDevices.find((el) => {
              return el.label.indexOf('back') > -1 && el.label.indexOf('0') > -1
            })
              ? videoDevices.find((el) => {
                  return (
                    el.label.indexOf('back') > -1 && el.label.indexOf('0') > -1
                  )
                }).deviceId
              : videoDevices[videoDevices.length - 1].deviceId
          }
          console.log('get-firstDeviceId', firstDeviceId)

          this.decodeFromInputVideoFunc(firstDeviceId)
        })
        .catch((err) => {
          this.tipShow = false
          console.error(err)
        })
    },
    decodeFromInputVideoFunc(firstDeviceId) {
      // 使用摄像头扫描
      this.codeReader.reset() // 重置
      this.codeReader.decodeFromInputVideoDeviceContinuously(
        firstDeviceId,
        'video',
        (result, err) => {
          this.tipMsg = 'Recognizing...'
          if (result) {
            console.log('扫码结果', result)
            this.scanText = result.text
            if (this.scanText) {
              this.codeReader.reset() // 关闭摄像头并停止扫码
              console.log(this.addInfo)
              this.tipShow = false
              if (this.addInfo === false) {
                console.log('addInfo')
                this.onAddBook(this.scanText)
              } else if (this.addInfo === true) {
                console.log('addInstance')
                this.onAddInstance(this.scanText)
              }

              // Dialog.confirm({
              //   // 获取到扫码结果进行弹窗提示，这部分接下去的代码根据需要，读者自行编写了
              //   title: '扫码结果',
              //   message: this.scanText
              // })
              //   .then(() => {
              //     // 点击确认
              //     Toast.success('扫码确认成功')
              //   })
              //   .catch(() => {
              //     // 点击取消
              //     this.clickIndexLeft()
              //   })
            }
          }
        }
      )
    },
    clickIndexLeft() {
      // 返回上一页
      this.$router.go(-1)
      // window.location.href = document.referrer;
    },
    onSuccess() {
      console.log('success')
      this.openScan()
    },
    onAddBook(scanText) {
      console.log('Ref to dialog1:', this.$refs.dialog1)
      if (this.$refs.dialog1) {
        this.$refs.dialog1.open({ text: scanText })
      }
      this.scanText = ''
    },
    onAddInstance(scanText) {
      console.log('Ref to dialog2:', this.$refs.dialog2)
      if (this.$refs.dialog2) {
        this.$refs.dialog2.openIns(scanText, -1)
        this.scanText = ''
      }
    }
  }
}
</script>

<template>
  <page-container title="Scan">
    <template #extra>
      <div class="form-row">
        Scan Mode
        <el-switch
          v-model="addInfo"
          class="mb-2"
          active-text="Add Instance"
          inactive-text="Add Info"
          style="margin-left: 10px"
        />
      </div>
    </template>
    <el-button type="primary" @click="openScan">Open camera</el-button>
    <div class="scan-page">
      <!-- 扫码区域 -->
      <video ref="video" id="video" class="scan-video" autoplay></video>
      <!-- 提示语 -->
      <div v-show="tipShow" class="scan-tip">{{ tipMsg }}</div>
    </div>
    <BookEdit ref="dialog1" @success="onSuccess"></BookEdit>
    <Instance ref="dialog2" @success="onSuccess"></Instance>
  </page-container>
</template>

<style lang="scss">
.scan-index-bar {
  background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  .van-nav-bar__title,
  .van-nav-bar__arrow,
  .van-nav-bar__text {
    color: #ffffff !important; // 确保文本颜色为白色以突出显示
    font-weight: bold; // 加粗字体
    font-size: 16px; // 增大按钮文字字体
  }

  padding: 10px 15px; // 增加内边距

  .van-nav-bar__title {
    font-size: 25px; // 增大标题字体
    flex: 1 1 100%; // 让标题尽可能填充剩余空间
    text-align: center; // 标题文本居中
    margin-bottom: 25px;
  }
  .van-nav-bar__left {
    display: flex; // 使用flex布局以便容易居中
    font-size: 25px; // 增大字体大小
    margin-left: 20px;
  }
}
.scan-page {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  .scan-video {
    height: 55vh;
  }
  .scan-tip {
    width: 100vw;
    text-align: center;
    color: rgb(116, 21, 95);
    font-size: 5vw;
  }
}
</style>
