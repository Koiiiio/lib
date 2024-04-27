<script lang="ts" setup>
//import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { GetBillService } from '../../api/user.js'

//import { onMounted } from 'vue'

// onMounted(() => {
//   userStore.getUser()
//   console.log('value', userStore.user.userId)
// })

let money = ref(9.9)
//let amount = ref(20)

const payBill = (row) => {
  window.open(
    'http://localhost:8080/api/alipay/pay?totalAmount=' +
      row.amount +
      '&subject=' +
      row.subject +
      '&userId=' +
      row.userId
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
  amount:''
})
const formLabelWidth = '140px'
const dialog = ref()
const charge = (amount) => {
  console.log(amount)
}
</script>
<template>
  <page-container title="Bill">
    <div>
      用户余额: {{ money }}
      <el-button plain @click="dialogFormVisible = true">
        Open a Form nested Dialog
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
  <el-dialog v-model="dialogFormVisible" title="Charge" width="500">
    <el-form :model="form">
      <el-form-item label="charge amount" :label-width="formLabelWidth">
        <el-input v-model="form.amount" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="charge(form.amount)">
          Confirm Charge
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
