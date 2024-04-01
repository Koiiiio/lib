<script setup>
import { ref } from 'vue'
import { EditBookService, AddBookService } from '@/api/book.js'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)
const formModel = ref({
  book_name: '',
  isbn: '',
  author: '',
  description: '',
  now_number: '0',
  lend_number: '0'
})
const formRef = ref()
const rules = {
  book_name: [
    { required: true, message: '请输入图书名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '必须是1 到 10 位非空字符',
      trigger: 'blur'
    } //长度校验
  ],
  author: [
    { required: true, message: '请输入图书作者', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '必须是1 到 10 位非空字符',
      trigger: 'blur'
    } //长度校验
  ],
  now_number: [
    { required: true, message: '请输入现存数量' },
    { type: 'number', message: '数量必须为数字值' }
  ],
  lend_number: [
    { required: true, message: '请输入现存数量' },
    { type: 'number', message: '数量必须为数字值' }
  ]
}

//open 方法
//open({}) 添加
//open({id,name...}) 编辑
const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row } //添加 重置        编辑 回显
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await EditBookService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await AddBookService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    :title="formModel.id ? '编辑图书' : '添加图书'"
    v-model="dialogVisible"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item prop="book_name" label="图书名称">
        <el-input
          v-model="formModel.book_name"
          placeholder="请输入图书名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="isbn" label="ISBN号">
        <el-input
          v-model="formModel.isbn"
          placeholder="请输入ISBN号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="author" label="图书作者">
        <el-input
          v-model="formModel.author"
          placeholder="请输入图书作者"
        ></el-input>
      </el-form-item>
      <el-form-item prop="description" label="图书描述">
        <el-input
          v-model="formModel.description"
          placeholder="请输入描述"
        ></el-input>
      </el-form-item>
      <el-form-item prop="now_number" label="现存数量">
        <el-input
          v-model.number="formModel.now_number"
          placeholder="请输入现存数量"
        ></el-input>
      </el-form-item>
      <el-form-item prop="lend_number" label="被借阅数量">
        <el-input
          v-model.number="formModel.lend_number"
          placeholder="请输入被借阅数量"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
