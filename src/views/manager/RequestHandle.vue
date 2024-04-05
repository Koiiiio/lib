<script setup>
import { ref } from 'vue'
import { Plus, Edit } from '@element-plus/icons-vue'
import { GetBorrowService, HandleRequest } from '../../api/book.js'
const agreeLend = () => {
  console.log()
}
const disagreeLend = () => {
  console.log()
}
const borrowList = ref()
const loading = ref(false)

const getBorrowList = async (approved) => {
  loading.value = false //true
  const res = await GetBorrowService(approved)
  borrowList.value = res.data.data
  //console.log(BorrowList.value)
  loading.value = false
}
getBorrowList(0)
</script>
<template>
  <page-container title="借阅处理">
    <el-table :data="borrowList">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column label="用户ID" prop="userId"> </el-table-column>
      <el-table-column label="图书实体ID" prop="instanceId"> </el-table-column>
      <el-table-column label="ISBN号" prop="isbn"></el-table-column>
      <el-table-column label="借阅日期" prop="borrowDate"></el-table-column>
      <el-table-column label="应归还日期" prop="dueDate"></el-table-column>
      <el-table-column
        label="借阅状态"
        prop="borrowAprvStatus"
      ></el-table-column>

      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <div style="display: flex">
            <el-button
              plain
              type="primary"
              :icon="Edit"
              @click="agreeLend(row)"
              :style="{ display: row.borrowAprvStatus == 0 ? 1 : '' }"
              >同意</el-button
            >
            <el-button
              plain
              type="warning"
              :icon="Plus"
              @click="disagreeLend(row)"
              :style="{ display: row.borrowAprvStatus == 0 ? 1 : '' }"
              >不同意</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </page-container>
</template>
