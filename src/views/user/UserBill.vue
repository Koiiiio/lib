<script lang="ts" setup>
//import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { Check } from '@element-plus/icons-vue'
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
</script>
<template>
  <page-container title="Bill">
    用户余额: {{ money }}

    <!-- <el-form label-width="100px">
      <el-form-item label="Amount">
        <el-input v-model="amount"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="payBill">Pay</el-button>
      </el-form-item>
    </el-form> -->
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
      <el-table-column label="Operation" width="250">
        <template #default="{ row }">
          <div style="display: flex">
            <el-button
              plain
              type="primary"
              :icon="Check"
              @click="payBill(row)"
              v-if="row.billStatus === 0"
              >Return</el-button
            >
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No data"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>

<style scoped></style>
