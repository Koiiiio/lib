<script setup>
import { ref } from 'vue'
import { LateReturn2 } from '@/api/book.js'
//import { ElMessage } from 'element-plus'

const formModel = ref({
  userId: '',
  borrowingId: '',
  instanceId: '',
  isbn: '',
  date: ''
})
const formRef = ref()
const rules = {}
const dialogVisible = ref(false)

const open = (row) => {
  //console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row }
}
// const LateReturn2 = async (row) => {
//   await Return(row.instanceId)
//   getUser()
//   if(user.value.money<=1){
//     ElMessage.error('No enough money!')
//   }
//   else{
//     ElMessage.success('Successful return!')
//   }
//   getBorrowList(state.value)
// }
const emit = defineEmits(['success'])
const onSubmit = async () => {
  const res = await LateReturn2({ borrowId: formModel.value.borrowingId })
  ElMessageBox.alert(
    '<strong>Tips</strong><br>Account balance: ' + res.data.data.money,
    {
      confirmButtonText: 'OK',
      dangerouslyUseHTMLString: true
    }
  )
  dialogVisible.value = false
  // await ElMessageBox.alert(
  //   'Borrow Success<br>Book ID: ' +
  //     instanceId +
  //     '<br>Book Location:' +
  //     location +
  //     '<br>Book duedate:' +
  //     duedate,
  //   'Borrowing tips:',
  //   {
  //     confirmButtonText: 'OK',
  //     dangerouslyUseHTMLString: true
  //   }
  // )
  emit('success') // 发射事件
  ElMessage.success('Successful!')
}
dialogVisible.value = false
defineExpose({
  open
})

const num = ref(' 1 $ for 5 days')
</script>
<template>
  <el-dialog
    title="Please confirm late return:"
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
      <el-form-item prop="" label="User ID">
        <el-input :placeholder="formModel.userId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="" label="Book ID">
        <el-input
          :placeholder="formModel.instanceId"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item prop="" label="BorrowDate">
        <el-input
          :placeholder="formModel.borrowDate"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item prop="date" label="Price">
        <!-- <el-date-picker
          v-model="formModel.date"
          type="date"
          placeholder="Pick a day"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
       -->
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
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit(formModel.instanceId)"
          >OK</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
