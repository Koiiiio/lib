<script lang="ts" setup>
//import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { GetBillService } from '../../api/user.js'
import { userGetStatusService } from '../../api/user.js'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores'
onMounted(() => {
  getUser()
  userStore.getUser()
})
const userStore = useUserStore()
const money = ref(9.9)
const subject = ref('')
const borrowPerms = ref('')
const getUser = async () => {
  const res = await userGetStatusService()
  money.value = res.data.data.money
  borrowPerms.value = res.data.data.borrowPerms
}
const payBill = async () => {
  if (!formRef.value) {
    console.warn('Form reference not found')
    return
  }
  const valid = await formRef.value.validate()
  if (!valid) return // 如果验证失败，停止执行
  window.open(
    'http://localhost:8080/api/alipay/pay?totalAmount=' +
      form.value.amount +
      '&subject=' +
      subject.value +
      '&userId=' +
      userStore.user.userId
  )
}
const BillList = ref([])
const loading = ref(false)
const getBillList = async () => {
  loading.value = false //true
  const res = await GetBillService()
  BillList.value = res.data.data
  loading.value = false
}
getBillList()
const dialogFormVisible = ref(false)
const form = ref({
  amount: ''
})
const formLabelWidth = '140px'
const rules = {
  amount: [
    { required: true, message: 'Please enter the quantity', trigger: 'blur' },
    {
      pattern: /^(?:[1-9]\d*|1000000000)$/,
      message: 'Must be an integer',
      trigger: 'blur'
    }
  ]
}
const cancel = () => {
  dialogFormVisible.value = false
  form.value.amount = ''
}
const formRef = ref(null)
</script>
<template>
  <page-container title="Bill">
    <div>
      <el-text tag="b" size="large">Balance:</el-text
      ><el-text type="primary" size="large"> {{ money }}</el-text>
      <el-text tag="b" size="large" style="margin-left: 50px">
        BorrowPerms:</el-text
      ><el-text type="primary" size="large"> {{ borrowPerms }}</el-text>

      <el-button
        type="primary"
        plain
        @click="dialogFormVisible = true"
        style="margin-left: 30px"
      >
        charge
      </el-button>
    </div>
    <el-table v-loading="loading" :data="BillList" style="width: 100%">
      <el-table-column
        prop="billId"
        label="Bill Record ID"
        width="100"
      ></el-table-column>
      <el-table-column prop="adminId" label="Librarian ID"></el-table-column>
      <el-table-column prop="userId" label="Reader Id"></el-table-column>
      <el-table-column
        prop="billSubject"
        label="bill Subject"
      ></el-table-column>
      <el-table-column prop="billAmount" label="billAmount"> </el-table-column>
      <el-table-column prop="billDate" label="billDate"></el-table-column>
      <el-table-column prop="billStatus" label="billStatus"></el-table-column>
      <template #empty>
        <el-empty description="No data"></el-empty>
      </template>
    </el-table>
  </page-container>
  <el-dialog
    v-model="dialogFormVisible"
    title="Charge"
    width="30%"
    :style="{ top: '17vh' }"
  >
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item
        label="charge amount"
        prop="amount"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.amount" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="payBill"> Confirm Charge </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
