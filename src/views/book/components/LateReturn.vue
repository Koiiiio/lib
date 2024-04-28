<script setup>
import { ref } from 'vue'
import { LateReturn2 } from '@/api/book.js'
import { userGetStatusService } from '@/api/user.js'
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
  console.log(1)
  console.log(formModel.value)
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
const onSubmit = async () => {
  getUser()
  if(user.value.money<=1){
    ElMessage.error('No enough money!')
  }
  else{
    await LateReturn2(row.instanceId)
    getUser()
    ElMessageBox.alert('Request submitted<br>Account balance: ' +
    user.value.money ,
    {
      confirmButtonText: 'OK',
      dangerouslyUseHTMLString: true 
    })
    ElMessage.success('Successful return!')
  }
  dialogVisible.value = false
}
defineExpose({
  open
})
const user = ref({})
const getUser = async () => {
      const res = await userGetStatusService()
      user.value = res.data.data
    }
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
      <el-form-item prop="" label="borrowDate">
        <el-input
          :placeholder="formModel.borrowDate"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item prop="date" label="Deferred Return to">
        <el-date-picker
          v-model="formModel.date"
          type="date"
          placeholder="Pick a day"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
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
