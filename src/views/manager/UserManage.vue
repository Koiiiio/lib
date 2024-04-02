<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { GetBorrowingService } from '../../api/user.js'
const userList = ref([])
const loading = ref(false)

const loadUserList = async () => {
  loading.value = false //true
  const res = await GetBorrowingService()
  userList.value = res.data.data
  console.log(userlist.value)
  loading.value = false
}
loadUserList()
const search1 = ref('')
const search2 = ref('')

const onSearch = () => {
  const filteredList = userlist.value.filter((user) => {
    return (
      user.userId.toString().includes(search1.value) &&
      user.username.includes(search2.value)
    )
  })
  userlist.value.splice(0, userlist.value.length, ...filteredList)
}

const onReset = () => {
  search1.value = ''
  search2.value = ''
  //loadUserList()
}
</script>
<template>
  <page-container title="用户管理">
    <template #extra>
      <el-button @click="onAddUser">添加用户</el-button>
    </template>
    <el-form inline>
      <el-form-item label="用户ID:">
        <el-input v-model="search1" placeholder="请输入用户ID" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="用户名:">
        <el-input v-model="search2" placeholder="用户名" clearable> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="userList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="邮箱地址"></el-table-column>
      <el-table-column prop="borrowDate" label="借阅日期"></el-table-column>
      <el-table-column prop="dueDate" label="应归还日期"></el-table-column>
      <el-table-column label="操作" width="150">
        <!--row 项 index 下标-->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            type="primary"
            plain
            @click="onEditUser(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            type="danger"
            plain
            @click="onDelUser(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>
