<script setup>
import { ref } from 'vue'
import { PieChart, Check } from '@element-plus/icons-vue'
import { GetBorrowRecord, Return } from '../../api/book.js'
const ReturnBook = async (row) => {
  console.log(row.instanceId)
  await ElMessageBox.confirm('你确认要归还吗?', '提示:', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
  await Return(row.instanceId)
  ElMessage.success('归还成功！')
  getBorrowList()
}
const LateReturnBook = async (row) => {
  console.log(row.returnDate)
  await ElMessageBox.confirm('你确认要申请迟还吗?', '提示:', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
}
// 删除逻辑
// const onDeleteBorrow = async (row) => {
//   // 提示用户是否要删除
//   await ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
//   })
//   await artDelService(row.id)
//   ElMessage.success('删除成功')
//   // 重新渲染列表
//   //getArticleList()
// }
// const borrowList = ref([
//   {
//     bookName: '申诉书',
//     bookid: 5193,
//     userid: 12341,
//     state: '未归还',
//     time0: 3.1,
//     time1: ' '
//   },
//   {
//     bookName: 'fsdfs',
//     bookid: 545,
//     userid: 12341,
//     state: '已归还',
//     time0: 3.1,
//     time1: 4.4
//   },
//   {
//     bookName: '的吗发觉',
//     bookid: 54293,
//     userid: 12341,
//     state: '未归还',
//     time0: 3.3,
//     time1: ' '
//   }
// ])
const borrowList = ref([])
const loading = ref(false)
const getBorrowList = async () => {
  loading.value = false //true
  const res = await GetBorrowRecord()
  borrowList.value = res.data.data
  //console.log(bookList.value)
  loading.value = false
}
getBorrowList()
</script>
<template>
  <page-container title="我的借阅">
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
          <span v-if="scope.row.borrowAprvStatus === 1">已批准</span>
          <span v-else-if="scope.row.borrowAprvStatus === 2">已拒绝</span>
          <span v-else>待审批</span>
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
              v-if="row.returnDate === null && row.borrowAprvStatus === 1"
              >归还</el-button
            >
            <el-button
              plain
              type="warning"
              :icon="PieChart"
              @click="LateReturnBook(row)"
              v-if="row.returnDate === null && row.borrowAprvStatus === 1"
              >迟还</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </page-container>
</template>
