<script setup>
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const formRef = ref()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const pwd = ref(userStore.user.password)
const checkIsPwd = (rule, value, callback) => {
  // 校验原密码
  if (value !== pwd.value) {
    callback(new Error('Incorrect original password'))
  } else {
    callback()
  }
}
const checkDifferent = (rule, value, callback) => {
  // 校验新密码和原密码不能一样
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('New password must be different from the original'))
  } else {
    callback()
  }
}
const checkSameAsNewPwd = (rule, value, callback) => {
  // 校验确认密码必须和新密码一样
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('Confirm password must match the new password'))
  } else {
    callback()
  }
}
const rules = ref({
  old_pwd: [
    {
      required: true,
      message: 'Please enter the original password',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 15,
      message: 'The original password should be 3 to 15 characters long',
      trigger: 'blur'
    },
    { validator: checkIsPwd, trigger: 'blur' }
  ],
  new_pwd: [
    {
      required: true,
      message: 'Please enter the new password',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 15,
      message: 'The new password should be 3 to 15 characters long',
      trigger: 'blur'
    },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    {
      required: true,
      message: 'Please enter the new password again',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 15,
      message:
        'The confirm password should be between 3 and 15 characters long',
      trigger: 'blur'
    },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
})

const router = useRouter()

const submitForm = async () => {
  await formRef.value.validate()
  pwd.value = pwdForm.value.re_pwd
  await userUpdatePasswordService({ password: pwd.value })
  //await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('Password Change Successful')

  //密码修改成功后，退出重新登录
  //清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})

  // 拦截登录
  router.push('/login')
}

const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <page-container title="Change Password">
    <el-row>
      <el-col :span="12">
        <el-form
          ref="formRef"
          :model="pwdForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="Original" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="New" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="Confirm" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">Change</el-button>
            <el-button @click="resetForm">Reset</el-button>
          </el-form-item>
        </el-form></el-col
      >
    </el-row>
  </page-container>
</template>
