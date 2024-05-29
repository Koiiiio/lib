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
  endDate: '',
  money: ''
})
const formRef = ref()
const num = ref(1)
const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row } //添加 Reset        编辑 回显
  formModel.value.id = formModel.value.userId
  formModel.value.name = formModel.value.username
  num.value = 1
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  formModel.value.money = num
  await Penalty({
    reason: formModel.value.reason,
    money: formModel.value.money,
    userId: formModel.value.id
  })

  dialogVisible.value = false
  ElMessage.success('Successful Penalty!')
  emit('success')
}
defineExpose({
  open
})
const rules = {
  reason: [
    {
      required: true,
      message: 'Please enter your penalty reason',
      trigger: 'blur'
    } //非空校验
  ]
}
</script>

<template>
  <el-dialog title="Penalize Readers" v-model="dialogVisible" width="30%">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
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
      <!-- <el-form-item prop="reason" label="Reason">
        <el-input
          v-model="formModel.reason"
          placeholder="Please enter the reason"
        ></el-input>
      </el-form-item> -->
      <el-form-item prop="reason" label="Reason">
        <el-input
          v-model="formModel.reason"
          style="width: 350px"
          :autosize="{ minRows: 1, maxRows: 5 }"
          type="textarea"
          placeholder="Please enter reason"
        />
      </el-form-item>
      <!-- <el-form-item prop="endDate" label="Penalty End Date">
        <el-date-picker
          v-model="formModel.endDate"
          type="date"
          placeholder="Pick a day"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item> -->
      <el-form-item prop="money" label="Penalty">
        <!-- <el-input v-model="formModel.money"></el-input> -->
        <el-input-number v-model="num" :min="1" :max="1000" />
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
