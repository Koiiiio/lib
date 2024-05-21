<script setup>
import { userRegisterService, userLoginService } from '@/api/user.js'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const isRegister = ref(false)
const form = ref()
const formModel = ref({
  username: '',
  password: '',
  repassword: '',
  email: '',
  userRole: 'user'
})
const rules = {
  username: [
    {
      required: true,
      message: 'Please enter your username or email address',
      trigger: 'blur'
    }, //非空校验
    {
      min: 3,
      max: 20,
      message: '3 to 20 characters long',
      trigger: 'blur'
    } //长度校验
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' }, //非空校验
    {
      pattern: /^\S{3,15}$/,
      message: '3 to 15 characters long',
      trigger: 'blur'
    } //长度校验
  ],
  repassword: [
    {
      required: true,
      message: 'Please enter your password again',
      trigger: 'blur'
    }, //非空校验
    {
      pattern: /^\S{3,15}$/,
      message: '3 to 15 characters long',
      trigger: 'blur'
    }, //长度校验
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('Passwords mismatch'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const register = async () => {
  //注册校验
  await form.value.validate()
  console.log(formModel.value)
  await userRegisterService(formModel.value)
  ElMessage.success('Successful registration')
  isRegister.value = false
}

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  //登录校验
  await form.value.validate()
  console.log(formModel.value)
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.data)

  console.log(res.data.data)

  ElMessage.success('Successful login')
  router.push('/bookchannel')
}

const role = ref('Reader')
const oprole = ref('Librarian')
const changeRole = () => {
  if (role.value === 'Reader') {
    role.value = 'Librarian'
    oprole.value = 'Reader'
  } else {
    role.value = 'Reader'
    oprole.value = 'Librarian'
  }
  formModel.value = {
    username: '',
    password: '',
    repassword: '',
    email: ''
  }
}
watch(role, () => {
  if (role.value == 'Librarian') formModel.value.userRole = 'admin'
  else formModel.value.userRole = 'user'
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <h1>LMS</h1>
      <!--注册表单-->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>-{{ role }} Register</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please enter your username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="formModel.email"
            :prefix-icon="Message"
            placeholder="Please enter your email"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please enter your password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please enter your password again"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            Register
          </el-button>
        </el-form-item>
        <el-button plain size="small" @click="changeRole"
          >Switch to {{ oprole }} Registration</el-button
        >
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← Back
          </el-link>
        </el-form-item>
      </el-form>

      <!--登录表单-->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <!-- <h1>-{{ role }}Login</h1> -->
          <h1>-Login</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please enter your username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please enter your password"
          ></el-input>
        </el-form-item>

        <el-form-item class="flex"> </el-form-item>

        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >Login</el-button
          >
        </el-form-item>
        <!-- <el-button plain size="small" @click="changeRole"
          >切换为{{ oprole }}登录</el-button
        > -->
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            Register →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
