<script setup>
import { ref } from 'vue'
import { GetReserveList } from '../../api/book.js'
const loading = ref(false)
const reserveList = ref([])
const getreserveList = async () => {
  loading.value = false //true
  const res = await GetReserveList()
  reserveList.value = res.data.data
  loading.value = false
}
getreserveList()
</script>
<template>
  <page-container title="我的预约">
    <el-table v-loading="loading" :data="reserveList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="title" label="图书标题"></el-table-column>
      <el-table-column prop="isbn" label="ISBN号"></el-table-column>
      <el-table-column prop="author" label="图书作者"></el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>

<style lang="scss" scoped></style>
