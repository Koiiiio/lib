<script setup>
import { ref } from 'vue'
import { Borrow } from '@/api/book.js'
//import { ElMessage } from 'element-plus'

const formModel = ref({
  id: '',
  title: '',
  isbn: '',
  author: '',
  description: '',
  date: 0
})
const formRef = ref()
const rules = {
  date: [
    { required: true, message: 'Please enter the date', trigger: 'blur' },
    {
      pattern: /^(?:[1-9]|[1-9]\d|100)$/,
      message: 'Must be a number between 1 and 100',
      trigger: 'blur'
    }
  ]
}
const dialogVisible = ref(false)
const currentDate = ref() //当前日期
const dueDate = ref() //应归还日期
//借阅天数

const getCurrentDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  currentDate.value = `${year}-${month}-${day}`
}
const getDueDate = (days) => {
  const today = new Date()
  const futureDate = new Date(today.setDate(today.getDate() + parseInt(days))) //借阅天数days
  const year = futureDate.getFullYear()
  const month = String(futureDate.getMonth() + 1).padStart(2, '0')
  const day = String(futureDate.getDate()).padStart(2, '0')
  dueDate.value = `${year}-${month}-${day}`
}

const BorrowDate = (days) => {
  getCurrentDate()
  console.log(currentDate.value)
  getDueDate(days)
  console.log(dueDate.value)
} //当前时间currentDate+借阅时间days=dueDate应归还日期

const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row }
}
const emit = defineEmits(['refresh-list'])
const onSubmit = async () => {
  await formRef.value.validate()
  BorrowDate(formModel.value.date)
  // console.log(formModel.value.isbn)
  // console.log(dueDate.value)
  const res = await Borrow({
    isbn: formModel.value.isbn,
    dueDate: dueDate.value
  })
  const instanceId = res.data.data.instanceId
  const location = res.data.data.location
  dialogVisible.value = false
  await ElMessageBox.alert(
    'Request submitted<br>Book ID: ' +
      instanceId +
      '<br>Book Location:' +
      location,
    'Borrowing tips:',
    {
      confirmButtonText: 'OK',
      dangerouslyUseHTMLString: true // 允许使用 HTML 标签
    }
  )

  emit('refresh-list') // 发射事件
}
defineExpose({
  open
})
</script>
<template>
  <el-dialog
    title="Please identify the books to be borrowed.:"
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
      <el-form-item prop="" label="Title">
        <el-input :placeholder="formModel.title" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="" label="ISBN">
        <el-input :placeholder="formModel.isbn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="" label="Author">
        <el-input :placeholder="formModel.author" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="date" label="Duration">
        <el-input
          v-model="formModel.date"
          placeholder="Please enter the number of days of borrowing"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>
