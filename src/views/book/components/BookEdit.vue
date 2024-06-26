<script setup>
import { ref, onMounted } from 'vue'
import {
  EditBookService,
  AddBookService,
  ISBNSearchService
} from '@/api/book.js'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
const dialogVisible = ref(false)
const formModel = ref({
  id: '',
  title: '',
  isbn: '',
  author: '',
  description: '',
  cover: ''
})
const formRef = ref()
const rules = {
  // title: [
  //   { required: true, message: '请输入图书名称', trigger: 'blur' },
  //   {
  //     pattern: /^\S{1,10}$/,
  //     message: '必须是1 到 10 位非空字符',
  //     trigger: 'blur'
  //   } //长度校验
  // ],
  // isbn: [
  //   { required: true, message: '请输入ISBN号', trigger: 'blur' },
  //   {
  //     pattern: /^\S{1,30}$/,
  //     message: '必须是1 到 30 位非空字符',
  //     trigger: 'blur'
  //   } //长度校验
  // ],
  // author: [
  //   { required: true, message: '请输入图书作者', trigger: 'blur' },
  //   {
  //     pattern: /^\S{1,10}$/,
  //     message: '必须是1 到 10 位非空字符',
  //     trigger: 'blur'
  //   } //长度校验
  // ]
}
const isEdit = ref(true)
//open 方法
//open({}) 添加
//open({id,name...}) 编辑
const open = (row) => {
  console.log(open)
  dialogVisible.value = true
  formModel.value = { ...row } // Spread existing row data or start fresh for add
  if (row && row.isbn) {
    // Edit mode
    isEdit.value = true
    formModel.value.id = formModel.value.title // Use title as id for editing
    imgUrl.value = formModel.value.cover
      ? `data:image/jpeg;base64,${formModel.value.cover}`
      : defaultCover
  } else {
    // Add mode
    isEdit.value = false
    formModel.value = {
      id: '',
      title: '',
      isbn: '',
      author: '',
      description: '',
      cover: ''
    } // Reset the form model
    if (row.text) {
      formModel.value.isbn = row.text
      search(row.text)
    }
    imgUrl.value = defaultCover // Use default cover image for new entries
  }
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  if (isEdit.value) {
    await EditBookService(formModel.value)
    ElMessage.success('Successful Edition')
  } else {
    await AddBookService(formModel.value)
    ElMessage.success('Successful Addition')
  }
  dialogVisible.value = false
  imgUrl.value = ''
  emit('success')
}
defineExpose({
  open
})
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  const reader = new FileReader()
  reader.onload = () => {
    const base64Data = reader.result
    imgUrl.value = base64Data // 预览图片
    const Data = reader.result.split(',')[1] // 去掉前缀
    formModel.value.cover = Data // 存入formModel
    console.log(formModel.value.cover)
  }
  //console.log(formModel.value.cover)
  reader.readAsDataURL(uploadFile.raw)
}
import defaultCover from '@/assets/defaultcover.jpg'

// 在组件加载时设置默认图片的URL
onMounted(() => {
  imgUrl.value = defaultCover
})
const search = async (isbn) => {
  console.log(isbn)
  const res = await ISBNSearchService({ isbn: isbn }) // 确保传入ISBN
  console.log(res.data)
  if (res.data && res.data.items && res.data.items.length > 0) {
    const volumeInfo = res.data.items[0].volumeInfo // 访问第一个item的volumeInfo
    formModel.value.title = volumeInfo.title
    formModel.value.description = volumeInfo.description
    // 处理可能的多个作者
    formModel.value.author = volumeInfo.authors.join(', ') // 将所有作者以逗号分隔
  } else {
    console.error('No data found for this ISBN')
  }
}
</script>

<template>
  <el-dialog
    :title="formModel.id ? 'Editing books' : 'Add book info'"
    v-model="dialogVisible"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px; display: flex; flex-direction: column"
    >
      <el-form-item prop="isbn" label="ISBN">
        <div style="display: flex">
          <el-input
            v-model="formModel.isbn"
            placeholder="Please enter the ISBN"
            :disabled="!!formModel.id"
          ></el-input>
          <el-button
            type="primary"
            @click="search(formModel.isbn)"
            v-if="!formModel.id"
            clsss="el-button"
          >
            auto
          </el-button>
        </div>
      </el-form-item>
      <el-form-item prop="title" label="Title">
        <el-input
          v-model="formModel.title"
          placeholder="Please enter the book title"
        ></el-input>
      </el-form-item>
      <el-form-item prop="author" label="Author">
        <el-input
          v-model="formModel.author"
          placeholder="Please enter the book author"
        ></el-input>
      </el-form-item>
      <el-form-item prop="description" label="Description">
        <!-- <el-input
          v-model="formModel.description"
          placeholder="Please enter description"
        ></el-input> -->
        <el-input
          v-model="formModel.description"
          style="width: 350px"
          :autosize="{ minRows: 1, maxRows: 5 }"
          type="textarea"
          placeholder="Please enter description"
        />
      </el-form-item>
      <el-form-item prop="location" label="Location">
        <el-input
          v-model="formModel.location"
          placeholder="Please enter location"
        ></el-input>
      </el-form-item>
      <el-form-item prop="cover" label="Cover">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img
            v-if="imgUrl"
            :src="imgUrl"
            style="max-width: 100%; max-height: 200px"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" style="margin-right: 10px"
          >Cancel</el-button
        >
        <el-button type="primary" @click="onSubmit">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped>
.dialog-footer {
  justify-content: flex-end;
  /* padding: 10px; */
}

.avatar-uploader-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* 确保按钮不会因为对话框宽度变化而移动位置 */
.el-button {
  margin-left: 5px; /* 自动向左对齐，确保按钮总是在最右侧 */
  margin-right: 10px;
}
</style>
