<script setup>
import { ref, watch } from 'vue'
import { PieChart } from '@element-plus/icons-vue'
import { GetBorrowRecord } from '../../api/book.js'

import LateReturn from '../book/components/LateReturn.vue'

// const ReturnBook = async (row) => {
//   console.log(row.instanceId)
//   await ElMessageBox.confirm('Are you sure you want to return it?', 'Tip', {
//     confirmButtonText: 'OK',
//     cancelButtonText: 'Cancel',
//     type: 'warning'
//   })
//   await Return(row.instanceId)
//   ElMessage.success('Successful return!')
//   getBorrowList(state.value)
// }
const dialog = ref()
//const dialog1 = ref()
const LateReturnBook = async (row) => {
  dialog.value.open(row)
  getBorrowList(state.value)
}

const state = ref('1')
const option = ref(true)
const borrowList = ref([])
const loading = ref(false)
const getBorrowList = async (state) => {
  loading.value = true //true
  const res = await GetBorrowRecord(state)
  console.log(res.data)
  borrowList.value = res.data.data
  loading.value = false
}
getBorrowList(state.value)
const onSuccess = () => {
  getBorrowList(state.value)
}
//const options = ref([
//   {
//     value: '0',
//     label: 'Pending'
//   },
//   {
//     value: '1',
//     label: 'Rejected'
//   },
// {
//   value: '2',
//   label: 'Returned'
// },
//   {
//     value: '3',
//     label: 'No Late Returns'
//   },
//   {
//     value: '3',
//     label: 'Late Returns Allowed'
//   }
// ])
// const options = ref([
//   {
//     value: '1',
//     label: 'Borrowing'
//   },
//   {
//     value: '0',
//     label: 'Returned'
//   }
// ])
watch(option, (newValue) => {
  // 监听 option 的变化，并在变化时重新获取列表
  if (newValue) getBorrowList(1)
  else getBorrowList(0)
  console.log(newValue)
})
</script>
<template>
  <page-container title="My Borrowing">
    <!-- <el-button type="primary" @click="QRReturn">camera</el-button> -->
    <template #extra>
      <div class="form-row">
        Borrowing Status
        <!-- <el-select
          v-model="option"
          placeholder="Please Select"
          class="select-box"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
        <el-switch
          v-model="option"
          active-text="Borrowing"
          inactive-text="Returned"
          style="margin-left: 10px; --el-switch-on-color: #13ce66"
        />
      </div>
    </template>

    <el-table :data="borrowList">
      <el-table-column type="index" label="No" width="100"></el-table-column>
      <el-table-column label="BorrowingId" prop="borrowingId">
      </el-table-column>
      <el-table-column label="Book ID" prop="instanceId"> </el-table-column>
      <el-table-column label="Reader ID" prop="userId"> </el-table-column>
      <el-table-column label="Borrow Date" prop="borrowDate"></el-table-column>
      <el-table-column label="Due Date" prop="dueDate"></el-table-column>
      <el-table-column
        label="Return Date"
        prop="returnDate"
        v-if="option == '0'"
      ></el-table-column>
      <!-- <el-table-column label="Request Status" prop="borrowAprvStatus">
        <template v-slot="scope">
           <span v-if="scope.row.borrowAprvStatus === 0">Pending</span>
          <span v-if="scope.row.borrowAprvStatus === 2">Rejected</span>
          <span
            v-if="
              scope.row.returnDate !== null && scope.row.borrowAprvStatus === 1
            "
            >Returned</span
          >
          <span
            v-if="
              scope.row.lateRetAprvStatus !== null &&
              scope.row.returnDate === null &&
              scope.row.borrowAprvStatus === 1
            "
            >No Late Returns</span
          >
          <span
            v-else-if="
              scope.row.lateRetAprvStatus === null &&
              scope.row.returnDate === null &&
              scope.row.borrowAprvStatus === 1
            "
            >Late Returns Allowed</span
          > 
          <span v-if="scope.row.borrowAprvStatus === 0">Returned</span>
          <span v-if="scope.row.borrowAprvStatus === 1">Borrowing</span>
        </template></el-table-column
      > -->

      <el-table-column label="Operations" width="250" v-if="option == '1'">
        <template #default="{ row }">
          <div style="display: flex">
            <!-- <el-button
              plain
              type="primary"
              :icon="Check"
              @click="ReturnBook(row)"
              v-if="row.returnDate === null && row.borrowAprvStatus === 1"
              >Return</el-button
            > -->
            <el-button
              plain
              type="warning"
              :icon="PieChart"
              @click="LateReturnBook(row)"
              v-if="option == '1'"
              >Late Return</el-button
            >
            <!-- <el-button
              plain
              type="warning"
              :icon="PieChart"
              @click="LateReturn2(row)"
              v-if="
                row.lateRetAprvStatus == null &&
                row.returnDate == null &&
                row.borrowAprvStatus == 1
              "
              >Late Return</el-button
            > -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <LateReturn ref="dialog" @success="onSuccess"></LateReturn>
  </page-container>
</template>
<style>
.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.select-box {
  width: 160px; /* 调整选择框的宽度 */
  margin-top: 1px;
}
</style>
