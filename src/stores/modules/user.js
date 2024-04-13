import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
//用户模块
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }
    const setUserAdmin = () => {
      user.value.userRole = 'admin'
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser,
      setUserAdmin
    }
  },
  {
    persist: true
  }
)
