<script setup>
import { ref, watch } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { GetBorrowService, HandleRequest } from '../../api/book.js'
import { ElMessage } from 'element-plus'

const borrowList = ref()
const loading = ref(false)
const switchValue = ref('0')

const getBorrowList = async (approved) => {
  loading.value = true
  const res = await GetBorrowService(approved)
  borrowList.value = res.data.data
  //console.log(BorrowList.value)
  loading.value = false
}
getBorrowList(switchValue.value)
// const displayedList = computed(() => {
//   const startIndex = (currentPage.value - 1) * pageSize.value
//   const endIndex = startIndex + pageSize.value
//   return borrowList.value.slice(startIndex, endIndex)
// })
const agreeLend = async (row) => {
  console.log(row.borrowingId)
  await HandleRequest(row.borrowingId, 1)
  ElMessage.success('审批成功')
  getBorrowList(switchValue.value)
}
const disagreeLend = async (row) => {
  await HandleRequest(row.borrowingId, 0)
  ElMessage.success('审批成功')
  getBorrowList(switchValue.value)
}
watch(switchValue, (newValue) => {
  // 监听 switchValue 的变化，并在变化时重新获取列表
  getBorrowList(newValue)
})
</script>
<template>
  <page-container title="借阅处理">
    <template #extra>
      <div class="extra-container">
        <div style="margin-right: 10px">未审批</div>
        <el-tooltip :content="'借阅状态: ' + switchValue" placement="top">
          <el-switch
            v-model="switchValue"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            active-value="1"
            inactive-value="0"
          />
        </el-tooltip>
        <div style="margin-left: 10px">已审批</div>
      </div>
    </template>

    <el-table :data="borrowList">
      <el-table-column label="借阅记录ID" prop="borrowingId"> </el-table-column>
      <el-table-column label="用户ID" prop="userId"> </el-table-column>
      <el-table-column label="用户名" prop="username"> </el-table-column>
      <el-table-column label="图书实体ID" prop="instanceId"> </el-table-column>
      <el-table-column label="ISBN号" prop="isbn"
        ><template #default="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            placement="bottom"
            :content="row.isbn"
          >
            <div class="ellipsis" :title="row.isbn">
              {{ row.isbn }}
            </div>
          </el-tooltip>
        </template></el-table-column
      >
      <el-table-column label="借阅日期" prop="borrowDate"></el-table-column>
      <el-table-column label="应归还日期" prop="dueDate"></el-table-column>
      <el-table-column
        label="借阅状态"
        prop="borrowAprvStatus"
      ></el-table-column>

      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <div style="display: flex; margin-right: 100px">
            <el-button
              plain
              type="primary"
              :icon="Check"
              @click="agreeLend(row)"
              v-if="row.borrowAprvStatus === 0"
              >同意</el-button
            >
            <el-button
              plain
              type="warning"
              :icon="Close"
              @click="disagreeLend(row)"
              v-if="row.borrowAprvStatus === 0"
              >不同意</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </page-container>
</template>
<style scoped>
.extra-container {
  display: flex;
  align-items: center;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap; /* 不换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  max-width: 150px; /* 设置最大宽度，根据需要调整 */
}
</style>
