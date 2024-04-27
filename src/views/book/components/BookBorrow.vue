<script setup>
import { ref } from 'vue'
import { Borrow } from '@/api/book.js'
//import { ElMessage } from 'element-plus'
const num = ref(5)
const formModel = ref({
  id: '',
  title: '',
  isbn: '',
  author: '',
  description: ''
})
const formRef = ref()
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
  //console.log(currentDate.value)
  getDueDate(days)
  //console.log(dueDate.value)
} //当前时间currentDate+借阅时间days=dueDate应归还日期

const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row }
}
const emit = defineEmits(['refresh-list'])
const onSubmit = async () => {
  //BorrowDate(num.value)
  const res = await Borrow({
    isbn: formModel.value.isbn
    // ,dueDate: dueDate.value
  })
  const instanceId = res.data.data.instanceId
  const location = res.data.data.location
  const duedate = res.data.data.duedate
  dialogVisible.value = false
  await ElMessageBox.alert(
    'Request submitted<br>Book ID: ' +
      instanceId +
      '<br>Book Location:' +
      location +
      '<br>Book duedate:' +
      duedate,
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
const Cancel = () => {
  dialogVisible.value = false
  num.value = 5
}
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
      <el-form-item prop="" label="Duration" :autofocus="true">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Default 5 days"
          placement="bottom-start"
        >
        <el-input :placeholder="num" :disabled="true"></el-input>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="Cancel">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>
