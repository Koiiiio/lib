<script setup>
import { ref, watch } from 'vue'
import { PieChart, Check } from '@element-plus/icons-vue'
import { GetBorrowRecord, Return } from '../../api/book.js'
import LateReturn from '../book/components/LateReturn.vue'
const ReturnBook = async (row) => {
  console.log(row.instanceId)
  await ElMessageBox.confirm('你确认要归还吗?', '提示:', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
  await Return(row.instanceId)
  ElMessage.success('归还成功！')
  getBorrowList(state.value)
}
const dialog = ref()
const LateReturnBook = async (row) => {
  dialog.value.open(row)
  getBorrowList(state.value)
}
const state = ref('1')
const option = ref('1')
const borrowList = ref([])
const loading = ref(false)
const getBorrowList = async (state) => {
  loading.value = true //true
  console.log(state)
  console.log(option.value)
  const res = await GetBorrowRecord(state)
  console.log(res.data)
  borrowList.value = res.data.data
  //console.log(bookList.value)
  loading.value = false
}
getBorrowList(state.value)
const onSuccess = () => {
  getBorrowList(state.value)
}
const options = ref([
  {
    value: '0',
    label: '未批阅'
  },
  {
    value: '1',
    label: '未通过'
  },
  {
    value: '2',
    label: '已归还'
  },
  {
    value: '3',
    label: '未归还(不可迟还)'
  },
  {
    value: '4',
    label: '未归还（可迟还）'
  }
])
watch(option, (newValue) => {
  // 监听 option 的变化，并在变化时重新获取列表
  getBorrowList(newValue)
  console.log(newValue)
})
</script>
<template>
  <page-container title="我的借阅">
    <template #extra>
      <div class="form-row">
        借阅状态
        <el-select v-model="option" placeholder="请选择" class="select-box">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </template>

    <el-table :data="borrowList">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column label="图书实体ID" prop="instanceId"> </el-table-column>
      <el-table-column label="ISBN号" prop="isbn"></el-table-column>
      <el-table-column label="借阅ID" prop="userId"> </el-table-column>
      <el-table-column label="借阅日期" prop="borrowDate"></el-table-column>
      <el-table-column label="应归还日期" prop="dueDate"></el-table-column>
      <el-table-column label="归还日期" prop="returnDate"></el-table-column>
      <el-table-column label="审批状态" prop="borrowAprvStatus">
        <template v-slot="scope">
          <span v-if="scope.row.borrowAprvStatus === 0">未审批</span>
          <span v-else-if="scope.row.borrowAprvStatus === 2">未通过</span>
          <span v-else-if="scope.row.returnDate !== null">已经归还</span>
          <span
            v-else-if="
              scope.row.lateRetAprvStatus !== 1 && scope.row.returnDate === null
            "
            >未归还（不可迟还）</span
          >
          <span
            v-else-if="
              scope.row.lateRetAprvStatus === 1 && scope.row.returnDate === null
            "
            >未归还（可迟还）</span
          >
        </template></el-table-column
      >

      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <div style="display: flex">
            <el-button
              plain
              type="primary"
              :icon="Check"
              @click="ReturnBook(row)"
              v-if="
                row.returnDate === null &&
                (row.borrowAprvStatus === 3 || row.borrowAprvStatus === 4)
              "
              >归还</el-button
            >
            <el-button
              plain
              type="warning"
              :icon="PieChart"
              @click="LateReturnBook(row)"
              v-if="row.returnDate === null && row.borrowAprvStatus === 4"
              >迟还</el-button
            >
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
