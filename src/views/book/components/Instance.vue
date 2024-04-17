<script setup>
import { ref } from 'vue'
import { AddInstanceService, DelInstanceService } from '@/api/book.js'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)
const formModel = ref({
  id: '',
  number: '',
  isbn: '',
  add: ''
})
const formRef = ref()
const rules = {
  number: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    {
      pattern: /^(?:[1-9]|[1-9]\d|100)$/,
      message: '必须是整数且小于100',
      trigger: 'blur'
    }
  ],
  id: [
    { required: true, message: '请输入id', trigger: 'blur' },
    {
      pattern: /^(?:[1-9]|[1-9]\d|1000000)$/,
      message: '必须是数字',
      trigger: 'blur'
    }
  ]
}

//open 方法
//open({}) 添加
//open({id,name...}) 编辑
const openIns = (isbn, id) => {
  dialogVisible.value = true
  formModel.value.isbn = isbn
  formModel.value.add = -id //id -1 添加   正id 删除
  if (id) formModel.value.id = id
  console.log(formModel.value)
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  const isAdd = formModel.value.add
  if (isAdd > 0) {
    await AddInstanceService({
      isbn: formModel.value.isbn,
      number: formModel.value.number
    })
    ElMessage.success('图书入库成功')
  } else {
    await DelInstanceService(formModel.value.id)
    ElMessage.success('图书出库成功')
  }
  dialogVisible.value = false
  formModel.value = {
    id: '',
    number: '',
    isbn: '',
    add: ''
  }
  emit('success')
}
defineExpose({
  openIns
})
</script>

<template>
  <el-dialog
    :title="formModel.add > 0 ? '图书入库' : '图书出库'"
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
      <el-form-item prop="isbn" label="ISBN号:">
        <el-input
          v-model="formModel.isbn"
          :disabled="!!formModel.isbn"
        ></el-input>
      </el-form-item>
      <el-form-item prop="number" label="添加数量:" v-if="formModel.add > 0">
        <el-input
          v-model="formModel.number"
          placeholder="请输入添加数量"
        ></el-input>
      </el-form-item>
      <el-form-item prop="id" label="删除图书ID:" v-if="formModel.add < 0">
        <el-input
          v-model="formModel.id"
          :disabled="!!formModel.isbn"
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
