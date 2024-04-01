<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'

const returnBook = (row) => {
  console.log(row.state == 0)
  //articleEditRef.value.open(row)
}

// 删除逻辑
const onDeleteBorrow = async (row) => {
  // 提示用户是否要删除
  await ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelService(row.id)
  ElMessage.success('删除成功')
  // 重新渲染列表
  //getArticleList()
}
const borrowList = ref([
  {
    bookName: '申诉书',
    bookid: 5193,
    userid: 12341,
    state: '未归还',
    time0: 3.1,
    time1: ' '
  },
  {
    bookName: 'fsdfs',
    bookid: 545,
    userid: 12341,
    state: '已归还',
    time0: 3.1,
    time1: 4.4
  },
  {
    bookName: '的吗发觉',
    bookid: 54293,
    userid: 12341,
    state: '未归还',
    time0: 3.3,
    time1: ' '
  }
])
</script>
<template>
  <page-container title="我的借阅">
    <el-table :data="borrowList">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column label="图书标题" prop="bookName"> </el-table-column>
      <el-table-column label="ISBN号" prop="bookid"></el-table-column>
      <el-table-column label="借阅ID" prop="userid"> </el-table-column>
      <el-table-column label="借阅时间" prop="time0"></el-table-column>
      <el-table-column label="归还时间" prop="time1"></el-table-column>
      <el-table-column label="借阅状态" prop="state"></el-table-column>

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            plain
            type="primary"
            :icon="Edit"
            @click="returnBook(row)"
            :style="{ display: row.state == '已归还' ? 'none' : '' }"
            >归还</el-button
          >
          <el-button
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteBorrow(row)"
            :style="{ display: row.state == '未归还' ? 'none' : '' }"
            >删除记录</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </page-container>
</template>
