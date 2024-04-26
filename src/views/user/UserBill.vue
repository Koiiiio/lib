<script lang="ts" setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
const userStore = useUserStore()
onMounted(() => {
  userStore.getUser()
  console.log('value', userStore.user.userId)
})

let money = ref(9.9)
let amount = ref(20)
let subject = ref('recharge')

const payBill = () => {
  window.open(
    'http://localhost:8080/api/alipay/pay?totalAmount=' +
      amount.value +
      '&subject=' +
      subject.value +
      '&userId=' +
      userStore.user.userId
  )
}
</script>
<template>
  <page-container title="Bill">
    用户余额: {{ money }}

    <el-form label-width="100px">
      <el-form-item label="Amount">
        <el-input v-model="amount"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="payBill">Pay</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style scoped></style>
