<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
const userStore = useUserStore()
const imgUrl = ref('')
const uploadRef = ref()

onMounted(async () => {
  // 在页面加载时重新获取用户头像
  await userStore.getUser()
  if (userStore.user.avatar) {
    // 添加 Base64 前缀
    imgUrl.value = `data:image/jpeg;base64, ${userStore.user.avatar}`
  }
})

const onSelectFile = (uploadFile) => {
  // 检查文件类型为 JPEG
  if (uploadFile.raw.type !== 'image/jpeg') {
    // 提示用户请选择 JPEG 格式的图片
    ElMessage.warning('Please select a JPEG format image')
    return
  }

  // 基于 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
    console.log(imgUrl.value)
  }
}

const isUpload = () => {
  if (imgUrl.value) return false
  else return true
}
const onUpdateAvatar = async () => {
  // 发送请求更新头像

  const base64Data = imgUrl.value.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
  await userUpdateAvatarService({ avatar: base64Data })
  // userStore 重新渲染
  await userStore.getUser()
  // 提示用户
  ElMessage.success('Successful avatar update')
}
</script>

<template>
  <page-container title="Change Avatar">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <!-- <img v-if="imgUrl" :src="imgUrl" class="avatar" /> -->
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <br />

    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >Select Image</el-button
    >
    <el-button
      @click="onUpdateAvatar"
      type="success"
      :icon="Upload"
      size="large"
      :disabled="isUpload()"
      >Upload avatar</el-button
    >
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
