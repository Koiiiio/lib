<script setup>
import { ref } from 'vue'
import { LateReturn } from '@/api/book.js'
//import { ElMessage } from 'element-plus'

const formModel = ref({
  userId: '',
  instanceId: '',
  isbn: '',
  date: ''
})
const formRef = ref()
const rules = {}
const dialogVisible = ref(false)

const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row }
}

const onSubmit = async () => {
  await formRef.value.validate()
  console.log(formModel.value.isbn)
  console.log(formModel.value.date)
  await LateReturn({
    borrowId: formModel.value.userId,
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
  ElMessage.success('申请迟还成功！')
}
defineExpose({
  open
})
</script>
<template>
  <el-dialog title="请确定迟还:" v-model="dialogVisible" width="30%">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item prop="" label="用户ID">
        <el-input :placeholder="formModel.useId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="" label="图书实体ID">
        <el-input
          :placeholder="formModel.instanceId"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item prop="" label="ISBN号">
        <el-input :placeholder="formModel.isbn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="date" label="预计迟还日期">
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
