<script setup>
import { ref } from 'vue'
import { Plus, Edit } from '@element-plus/icons-vue'
import { GetLateListService } from '../../api/book.js'
const agreeLate = () => {
  console.log('1')
}
const disagreeLate = () => {
  console.log('0')
}
const LateList = ref()
const loading = ref(false)

const getLateList = async () => {
  loading.value = false //true
  const res = await GetLateListService(0)
  LateList.value = res.data.data
  //console.log(BorrowList.value)
  loading.value = false
}
getLateList()
</script>
<template>
  <page-container title="借阅处理">
    <el-table :data="LateList">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column label="用户ID" prop="userId"> </el-table-column>
      <el-table-column label="用户名" prop="username"> </el-table-column>
      <el-table-column label="图书实体ID" prop="instanceId"> </el-table-column>
      <el-table-column label="ISBN号" prop="isbn"></el-table-column>
      <el-table-column label="借阅日期" prop="borrowDate"></el-table-column>
      <el-table-column label="应归还时间" prop="dueDate"></el-table-column>\
      <el-table-column label="迟还日期" prop="lateRetDate"></el-table-column>
      <el-table-column
        label="审批状态"
        prop="lateRetAprvStatus"
      ></el-table-column>

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            plain
            type="primary"
            :icon="Edit"
            @click="agreeLate(row)"
            :style="{ display: row.borrowAprvStatus == 0 ? 1 : '' }"
            >同意</el-button
          >
          <el-button
            plain
            type="warning"
            :icon="Plus"
            @click="disagreeLate(row)"
            :style="{ display: row.borrowAprvStatus == 0 ? 1 : '' }"
            >不同意</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </page-container>
</template>
