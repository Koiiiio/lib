<script setup>
import { ref } from 'vue'
import { GetReserveList, CancelReserve } from '../../api/book.js'
const loading = ref(false)
const reserveList = ref([])
const getreserveList = async () => {
  loading.value = false //true
  const res = await GetReserveList()
  reserveList.value = res.data.data
  loading.value = false
}
getreserveList()
const Cancel = async (row) => {
  await ElMessageBox.confirm('你确认要取消预约吗?', '提示:', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
  await CancelReserve(row.isbn)
  ElMessage.success('取消成功！')
  getreserveList()
}
</script>
<template>
  <page-container title="我的预约">
    <el-table v-loading="loading" :data="reserveList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="title" label="图书标题"></el-table-column>
      <el-table-column prop="isbn" label="ISBN号"></el-table-column>
      <el-table-column prop="author" label="图书作者"></el-table-column>
      <el-table-column prop="cover" label="封面图片">
        <template #default="{ row }">
          <div
            class="thumbnail"
            :style="{
              'background-image': `url(data:image/jpeg;base64,${row.cover})`
            }"
          ></div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="available" label="现存数量"></el-table-column>
      <el-table-column prop="borrowed" label="被借阅数量"></el-table-column>
      <el-table-column label="操作" width="300">
        <!--row 项 index 下标-->
        <template #default="{ row, $index }">
          <div style="display: flex">
            <el-button type="primary" @click="Cancel(row, $index)"
              >取消预约</el-button
            >
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>

<style lang="scss" scoped>
.thumbnail {
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center;
}
</style>
