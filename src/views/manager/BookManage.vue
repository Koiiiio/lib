<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { GetBookService, DelBookService } from '../../api/book.js'
import BookEdit from '../book/components/BookEdit.vue'

const bookList = ref([])
const loading = ref(false)
const dialog = ref()

const getBookList = async () => {
  loading.value = false //true
  const res = await GetBookService()
  bookList.value = res.data.data
  console.log(bookList.value)
  loading.value = false
}

getBookList()

const onEditBook = (row) => {
  dialog.value.open(row)
}
const onDelBook = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗?', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await DelBookService(row.id)
  ElMessage.success('删除成功')
  getBookList()
}
const onAddBook = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getBookList()
}

const search1 = ref('')
const search2 = ref('')

const onSearch = () => {
  const filteredList = bookList.value.filter((book) => {
    return (
      book.cate_name.includes(search1.value) &&
      book.cate_alias.includes(search2.value)
    )
  })
  bookList.value.splice(0, bookList.value.length, ...filteredList)
}

const onReset = () => {
  search1.value = ''
  search2.value = ''
  getBookList()
}
</script>
<template>
  <page-container title="图书目录">
    <template #extra>
      <el-button @click="onAddBook">添加图书</el-button>
    </template>
    <el-form inline>
      <el-form-item label="图书标题:">
        <el-input v-model="search1" placeholder="请输入图书标题" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="图书作者:">
        <el-input v-model="search2" placeholder="请输入作者" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="bookList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="标题"></el-table-column>
      <el-table-column prop="" label="ISBN号"></el-table-column>
      <el-table-column prop="cate_alias" label="作者"></el-table-column>
      <el-table-column prop="" label="描述"></el-table-column>
      <el-table-column prop="" label="现存数量"></el-table-column>
      <el-table-column prop="" label="被借阅数量"></el-table-column>
      <el-table-column label="操作" width="150">
        <!--row 项 index 下标-->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            type="primary"
            plain
            @click="onEditBook(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            type="danger"
            plain
            @click="onDelBook(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <BookEdit ref="dialog" @success="onSuccess"></BookEdit>
  </page-container>
</template>
