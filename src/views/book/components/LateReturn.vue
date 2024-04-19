<script setup>
import { ref } from 'vue'
import { LateReturn } from '@/api/book.js'
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

const onSubmit = async () => {
  await formRef.value.validate()
  //console.log(formModel.value.isbn)
  //console.log(formModel.value.date)
  await LateReturn({
    borrowId: formModel.value.borrowingId,
    lateRetDate: formModel.value.date
  })
  //   ElMessageBox.alert(
  //     '已提交申请：<br>书实体ID: ' + instanceId + '<br>借阅图书位置: ' + location,
  //     '借阅提示:',
  //     {
  //       confirmButtonText: 'OK',
  //       dangerouslyUseHTMLString: true // 允许使用 HTML 标签
  //     }
  //   )
  dialogVisible.value = false
  ElMessage.success('Successful Late Return Request!')
}
defineExpose({
  open
})
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
