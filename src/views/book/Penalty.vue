<script setup>
import { ref } from 'vue'
//import { PieChart, Check } from '@element-plus/icons-vue'
import { GetPenaltyService } from '../../api/book.js'

const PenaltyList = ref([])
const loading = ref(false)
const getPenaltyList = async () => {
  loading.value = false //true
  const res = await GetPenaltyService()
  PenaltyList.value = res.data.data
  //console.log(bookList.value)
  loading.value = false
}
getPenaltyList()
</script>

<template>
  <page-container title="处分记录">
    <el-table v-loading="loading" :data="PenaltyList" style="width: 100%">
      <el-table-column
        prop="penaltyId"
        label="处分记录ID"
        width="100"
      ></el-table-column>
      <el-table-column prop="adminId" label="管理员ID"></el-table-column>
      <el-table-column prop="adminName" label="管理员用户名"></el-table-column>
      <el-table-column prop="adminEmail" label="管理员邮箱"></el-table-column>
      <el-table-column prop="userId" label="用户Id"> </el-table-column>
      <el-table-column prop="username" label="被处分人用户名"></el-table-column>
      <el-table-column prop="reason" label="处分原因"></el-table-column>
      <el-table-column prop="penaltyDate" label="处分日期"></el-table-column>
      <el-table-column prop="endDate" label="处分结束日期"></el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>
