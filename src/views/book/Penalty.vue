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
  <page-container title="Penalty Record">
    <el-table v-loading="loading" :data="PenaltyList" style="width: 100%">
      <el-table-column
        prop="penaltyId"
        label="Penalty Record ID"
        width="100"
      ></el-table-column>
      <el-table-column prop="adminId" label="Librarian ID"></el-table-column>
      <el-table-column
        prop="adminName"
        label="Librarian Username"
      ></el-table-column>
      <el-table-column
        prop="adminEmail"
        label="Librarian Email"
      ></el-table-column>
      <el-table-column prop="userId" label="Reader Id"> </el-table-column>
      <el-table-column
        prop="username"
        label="Reader Username"
      ></el-table-column>
      <el-table-column prop="reason" label="Penalty Reason"></el-table-column>
      <el-table-column prop="money" label="Penalty Money"></el-table-column>
      <!-- <el-table-column
        prop="penaltyDate"
        label="Penalty Date"
      ></el-table-column>
      <el-table-column
        prop="endDate"
        label="Penalty End Date"
      ></el-table-column> -->

      <template #empty>
        <el-empty description="No data"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>
