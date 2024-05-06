<script setup>
import { ref } from 'vue'
import { Penalty } from '@/api/book.js'
import { ElMessage } from 'element-plus'
import {} from '@element-plus/icons-vue'
const dialogVisible = ref(false)
const formModel = ref({
  id: '',
  name: '',
  reason: '',
  endDate: ''
})
const formRef = ref()

const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row } //添加 Reset        编辑 回显
  formModel.value.id = formModel.value.userId
  formModel.value.name = formModel.value.username
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await Penalty({
    reason: formModel.value.reason,
    endDate: formModel.value.endDate,
    userId: formModel.value.id
  })

  dialogVisible.value = false
  ElMessage.success('Successful Penalty!')
  emit('success')
}
defineExpose({
  open
})
</script>

<template>
  <el-dialog title="Penalize Readers" v-model="dialogVisible" width="30%">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item prop="id" label="User ID">
        <el-input
          v-model="formModel.id"
          :disabled="!!formModel.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name" label="User">
        <el-input
          v-model="formModel.name"
          :disabled="!!formModel.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="reason" label="Reason">
        <el-input
          v-model="formModel.reason"
          placeholder="Please enter the reason"
        ></el-input>
      </el-form-item>
      <el-form-item prop="endDate" label="Penalty End Date">
        <el-date-picker
          v-model="formModel.endDate"
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
