<script setup>
import { ref, computed } from 'vue'
import { CloseBold } from '@element-plus/icons-vue'
import { GetBorrowingService } from '../../api/user.js'
import { admitReturn } from '../../api/book.js'
import UserPenalty from '../book/components/UserPenalty.vue'
const userList = ref([])
const loading = ref(false)

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const loadUserList = async () => {
  loading.value = false //true
  const res = await GetBorrowingService()
  userList.value = res.data.data
  //console.log(userlist.value)
  total.value = userList.value.length
  loading.value = false
}
loadUserList()
const displayedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return userList.value.slice(startIndex, endIndex)
})
const search1 = ref('')
const search2 = ref('')

const onSearch = () => {
  const filteredList = userList.value.filter((user) => {
    return (
      user.userId.toString().includes(search1.value) &&
      user.username.includes(search2.value)
    )
  })
  userList.value.splice(0, userList.value.length, ...filteredList)
}

const onReset = () => {
  search1.value = ''
  search2.value = ''
  loadUserList()
}

const onSuccess = () => {
  loadUserList()
}
const dialog = ref()
const penalty = (row) => {
  dialog.value.open(row)
}
const admit = async (row) => {
  await admitReturn(row.instanceId)
  ElMessage.success('Successful return!')
  loadUserList()
}
</script>
<template>
  <page-container title="Reader Management">
    <el-form inline>
      <el-form-item label="Reader ID:">
        <el-input v-model="search1" placeholder="ID" clearable> </el-input>
      </el-form-item>
      <el-form-item label="Reader Username:">
        <el-input v-model="search2" placeholder="Username" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">Search</el-button>
        <el-button @click="onReset">Reset</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="displayedUsers" style="width: 100%">
      <el-table-column type="index" label="No"></el-table-column>
      <el-table-column prop="userId" label="ID"></el-table-column>
      <el-table-column prop="username" label="User"></el-table-column>
      <el-table-column prop="email" label="Email"
        ><template #default="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            placement="bottom"
            :content="row.email"
          >
            <div class="ellipsis">
              {{ row.email }}
            </div>
          </el-tooltip>
        </template></el-table-column
      >
      <el-table-column
        prop="borrowDate"
        label="Borrow Date"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="dueDate"
        label="Due Date"
        width="150"
      ></el-table-column>
      <el-table-column prop="isbn" label="ISBN" width="200"
        ><template #default="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            placement="bottom"
            :content="row.isbn"
          >
            <div class="ellipsis">
              {{ row.isbn }}
            </div>
          </el-tooltip>
        </template></el-table-column
      >
      <el-table-column
        prop="instanceId"
        label="instanceId"
        width="150"
      ></el-table-column>
      <el-table-column label="Operations" width="350">
        <!--row 项 index 下标-->
        <template #default="{ row, $index }">
          <div style="display: flex">
            <el-button type="primary" plain @click="admit(row)"
              >Confirm Return</el-button
            >
            <el-button
              :icon="CloseBold"
              type="danger"
              plain
              @click="penalty(row, $index)"
              >Penalty</el-button
            >
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No data"></el-empty>
      </template>
    </el-table>
    <UserPenalty ref="dialog" @success="onSuccess"></UserPenalty>
  </page-container>
</template>
<style scoped>
.ellipsis {
  overflow: hidden;
  white-space: nowrap; /* 不换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  max-width: 150px; /* 设置最大宽度，根据需要调整 */
}
</style>
