<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

const formRef = ref()

// 是在使用仓库中数据的初始值 (无需响应式) 解构无问题
const {
  user: { email, username },
  getUser
} = useUserStore()

const form = ref({
  username,
  email
})

const rules = ref({
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please enter the correct email format',
      trigger: ['blur', 'change']
    }
  ]
})

const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate()
  // 提交修改
  //console.log(form.value.email)
  await userUpdateInfoService({ email: form.value.email })
  // 通知 user 模块，进行数据的更新
  getUser()
  // 提示用户
  ElMessage.success('Modify successfully')
}
</script>
<template>
  <page-container title="Basic Info">
    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="Account">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
