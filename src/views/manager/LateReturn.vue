<script setup>
import { ref, watch } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { GetLateListService, HandleLateReturn } from '../../api/book.js'

const agreeLate = async (row) => {
  await HandleLateReturn({ borrowingId: row.borrowingId, agree: 1 })
  ElMessage.success('Request processed successfully!')
  getLateList(switchValue.value)
}
const disagreeLate = async (row) => {
  await HandleLateReturn({ borrowingId: row.borrowingId, agree: 0 })
  ElMessage.success('Request processed successfully!')
  getLateList(switchValue.value)
}
const LateList = ref()
const loading = ref(false)
const switchValue = ref('0')
const getLateList = async (approved) => {
  loading.value = false //true
  const res = await GetLateListService(approved)
  LateList.value = res.data.data
  //console.log(BorrowList.value)
  loading.value = false
}
getLateList(switchValue.value)
watch(switchValue, (newValue) => {
  // 监听 switchValue 的变化，并在变化时重新获取列表
  getLateList(newValue)
})
</script>
<template>
  <page-container title="Late return processing">
    <template #extra>
      <div class="extra-container">
        <div style="margin-right: 10px">Pending</div>
        <el-tooltip :content="'Status: ' + switchValue" placement="top">
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
        <div style="margin-left: 10px">Resolved</div>
      </div>
    </template>
    <el-table :data="LateList">
      <el-table-column
        label="Borrowing ID"
        prop="borrowingId"
      ></el-table-column>
      <el-table-column label="Reader ID" prop="userId"> </el-table-column>
      <el-table-column label="Reader Username" prop="username">
      </el-table-column>
      <el-table-column label="Book ID" prop="instanceId"> </el-table-column>
      <el-table-column label="ISBN" prop="isbn"
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
      <el-table-column label="Borrow Date" prop="borrowDate"></el-table-column>
      <el-table-column label="Due Date" prop="dueDate"></el-table-column>
      <el-table-column
        label="Late Return Date"
        prop="lateRetDate"
      ></el-table-column>
      <el-table-column label="Request Status" prop="lateRetAprvStatus"
        ><template v-slot="scope">
          <span v-if="scope.row.lateRetAprvStatus === 0">Pending</span>
          <span v-if="scope.row.lateRetAprvStatus === 1">Accepted</span>
          <span v-if="scope.row.lateRetAprvStatus === 2">Rejected</span>
        </template>
      </el-table-column>

      <el-table-column label="Operations" width="250">
        <template #default="{ row }">
          <div style="display: flex; margin-right: 100px">
            <el-button
              plain
              type="primary"
              :icon="Check"
              @click="agreeLate(row)"
              v-if="row.lateRetAprvStatus === 0"
              >Accept</el-button
            >
            <el-button
              plain
              type="warning"
              :icon="Close"
              @click="disagreeLate(row)"
              v-if="row.lateRetAprvStatus === 0"
              >Reject</el-button
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
