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
  formModel.value = { ...row } //添加 重置        编辑 回显
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

  ElMessage.success('处分成功!')

  dialogVisible.value = false
  emit('success')
}
defineExpose({
  open
})
</script>

<template>
  <el-dialog title="处分读者" v-model="dialogVisible" width="30%">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item prop="id" label="用户名称">
        <el-input
          v-model="formModel.id"
          :disabled="!!formModel.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name" label="用户名">
        <el-input
          v-model="formModel.name"
          :disabled="!!formModel.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="reason" label="处分理由">
        <el-input
          v-model="formModel.reason"
          placeholder="请输入处分理由"
        ></el-input>
      </el-form-item>
      <el-form-item prop="endDate" label="处分结束日期">
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
