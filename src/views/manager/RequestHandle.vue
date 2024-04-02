<script setup>
import { ref } from 'vue'
import { Plus, Edit } from '@element-plus/icons-vue'
import { GetBorrowService } from '../../api/book.js'
const agreeLend = () => {
  console.log()
}
const disagreeLend = () => {
  console.log()
}
const borrowList = ref()
const loading = ref(false)

const getBorrowList = async () => {
  loading.value = false //true
  const res = await GetBorrowService(0)
  BorrowList.value = res.data.data
  //console.log(BorrowList.value)
  loading.value = false
}
getBorrowList()
</script>
<template>
  <page-container title="借阅处理">
    <el-table :data="borrowList">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column label="用户ID" prop="userId"> </el-table-column>
      <el-table-column label="图书实体ID" prop="instanceId"> </el-table-column>
      <el-table-column label="ISBN号" prop="isbn"></el-table-column>
      <el-table-column label="借阅日期" prop="borrowDate"></el-table-column>
      <el-table-column label="应归还时间" prop="dueDate"></el-table-column>
      <el-table-column
        label="借阅状态"
        prop="borrowAprvStatus"
      ></el-table-column>

      <el-table-column label="操作">
        <template #default="{ row }">
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
        </template>
      </el-table-column>
    </el-table>
  </page-container>
</template>
