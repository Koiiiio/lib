<script setup>
import { ref, watch } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { GetLateListService, HandleLateReturn } from '../../api/book.js'

const agreeLate = async (row) => {
  await HandleLateReturn({ borrowingId: row.borrowingId, agree: 1 })
  ElMessage.success('审批成功！')
  getLateList(switchValue.value)
}
const disagreeLate = async (row) => {
  await HandleLateReturn({ borrowingId: row.borrowingId, agree: 0 })
  ElMessage.success('审批成功！')
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
  <page-container title="迟还处理">
    <template #extra>
      <div class="extra-container">
        <div style="margin-right: 10px">未审批</div>
        <el-tooltip :content="'审批状态: ' + switchValue" placement="top">
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
    <el-table :data="LateList">
      <el-table-column label="借阅记录ID" prop="borrowingId"></el-table-column>
      <el-table-column label="用户ID" prop="userId"> </el-table-column>
      <el-table-column label="用户名" prop="username"> </el-table-column>
      <el-table-column label="图书实体ID" prop="instanceId"> </el-table-column>
      <el-table-column label="ISBN号" prop="isbn"></el-table-column>
      <el-table-column label="借阅日期" prop="borrowDate"></el-table-column>
      <el-table-column label="应归还时间" prop="dueDate"></el-table-column>\
      <el-table-column label="迟还日期" prop="lateRetDate"></el-table-column>
      <el-table-column label="审批状态" prop="lateRetAprvStatus"
        ><template v-slot="scope">
          <span v-if="scope.row.lateRetAprvStatus === 0">未审批</span>
          <span v-if="scope.row.lateRetAprvStatus === 1">已同意</span>
          <span v-if="scope.row.lateRetAprvStatus === 2">已拒绝</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <div style="display: flex">
            <el-button
              plain
              type="primary"
              :icon="Check"
              @click="agreeLate(row)"
              v-if="row.lateRetAprvStatus === 0"
              >同意</el-button
            >
            <el-button
              plain
              type="warning"
              :icon="Close"
              @click="disagreeLate(row)"
              v-if="row.lateRetAprvStatus === 0"
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
</style>
