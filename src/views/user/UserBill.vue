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
const borrowPerms = ref('')
const getUser = async () => {
  const res = await userGetStatusService()
  money.value = res.data.data.money
  borrowPerms.value = res.data.data.borrowPerms
}
const alipayUrl = import.meta.env.VITE_ALIPAY_URL
const payBill = async () => {
  if (!formRef.value) {
    console.warn('Form reference not found')
    return
  }
  const valid = await formRef.value.validate()
  if (!valid) return // 如果验证失败，停止执行
  window.open(
    //FIXME alipay
    alipayUrl +
      form.value.amount +
      '&subject=' +
      'recharge' +
      '&userId=' +
      userStore.user.userId
  )
  dialogFormVisible.value = false
  refreshDialogVisible.value = true
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
const refreshDialogVisible = ref(false)
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
const refresh = () => {
  refreshDialogVisible.value = false
  getUser()
  getBillList()
}
</script>
<template>
  <page-container title="Bill">
    <div>
      <el-text tag="b" size="large">Balance: </el-text
      ><el-text type="primary" size="large"> {{ money }}</el-text>
      <el-button
        type="primary"
        plain
        @click="dialogFormVisible = true"
        style="margin-left: 30px"
      >
        Charge
      </el-button>

      <el-text tag="b" size="large" style="margin-left: 50px">
        Available Books for Borrowing: </el-text
      ><el-text type="primary" size="large"> {{ borrowPerms }}</el-text>
    </div>
    <el-table
      v-loading="loading"
      :data="BillList"
      style="width: 100%"
      :default-sort="{ prop: 'billDate', order: 'descending' }"
    >
      <el-table-column prop="billId" label="Bill Record ID"></el-table-column>
      <el-table-column prop="userId" label="Reader Id"></el-table-column>
      <el-table-column
        prop="billSubject"
        label="bill Subject"
      ></el-table-column>
      <el-table-column prop="billAmount" label="bill Amount"> </el-table-column>
      <el-table-column prop="billDate" label="bill Date"></el-table-column>
      <el-table-column prop="billStatus" label="bill Status">
        <template v-slot="scope">
          <span v-if="scope.row.billStatus === 0">non-payment</span>
          <span v-if="scope.row.billStatus === 1">paid</span>
        </template></el-table-column
      >
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
        <el-button type="primary" @click="payBill">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="refreshDialogVisible"
    title="Having paid?"
    width="500"
    align-center
    ><span>If the payment has been made, it will arrive in 1-3min</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="refreshDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="refresh"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
