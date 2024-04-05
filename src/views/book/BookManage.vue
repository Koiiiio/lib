<script setup>
import { ref } from 'vue'
import { Delete, PieChart, Check } from '@element-plus/icons-vue'
import { GetBorrowRecord, Return } from '../../api/book.js'
const ReturnBook = async (row) => {
  console.log(row.instanceId)
  await Return(row.instanceId)
  ElMessage.success('归还成功！')
  getBorrowList()
}
const LateReturnBook = (row) => {
  console.log(row.returnDate)
  //articleEditRef.value.open(row)
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
      <el-table-column
        label="审批状态"
        prop="borrowAprvStatus"
      ></el-table-column>

      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <div style="display: flex">
            <el-button
              plain
              type="primary"
              :icon="Check"
              @click="ReturnBook(row)"
              v-if="row.returnDate === null"
              >归还</el-button
            >
            <el-button
              plain
              type="warning"
              :icon="PieChart"
              @click="LateReturnBook(row)"
              v-if="row.returnDate === null"
              >迟还</el-button
            >
            <el-button
              plain
              type="danger"
              :icon="Delete"
              click=""
              v-if="row.returnDate !== null"
              >删除记录</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </page-container>
</template>
