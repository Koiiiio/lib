<script setup>
import { ref } from 'vue'
import { GetBookService } from '../../api/book.js'
import {} from '@element-plus/icons-vue'
import BookBorrow from '../book/components/BookBorrow.vue'
const bookList = ref([])
const loading = ref(false)

const getBookList = async () => {
  loading.value = false //true
  const res = await GetBookService()
  bookList.value = res.data.data
  //console.log(bookList.value)
  loading.value = false
}

getBookList()
const onSuccess = () => {
  getBookList()
}
const search1 = ref('')

const onSearch = () => {
  const filteredList = bookList.value.filter((book) => {
    if (option.value === 'title') {
      return book.title.includes(search1.value)
    } else if (option.value === 'author') {
      return book.author.includes(search1.value)
    } else if (option.value === 'isbn') {
      return book.isbn.includes(search1.value)
    }
  })
  bookList.value.splice(0, bookList.value.length, ...filteredList)
}

const onReset = () => {
  search1.value = ''
  getBookList()
}

const options = ref([
  {
    value: 'title',
    label: '图书标题'
  },
  {
    value: 'author',
    label: '图书作者'
  },
  {
    value: 'isbn',
    label: 'ISBN号'
  }
])
const option = ref('title')
const setPlaceholder = (option) => {
  if (option === 'title') {
    return '请输入图书标题'
  } else if (option === 'author') {
    return '请输入图书作者'
  } else if (option === 'isbn') {
    return '请输入ISBN号'
  }
}

const dialog = ref()
const borrowBook = async (row) => {
  dialog.value.open(row)
}

const reserveBook = () => {
  console.log('reserve')
}
</script>

<template>
  <page-container title="图书目录">
    <el-form inline>
      <div class="form-row">
        <el-select v-model="option" placeholder="请选择" class="select-box">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-form-item>
          <el-input
            v-model="search1"
            :placeholder="setPlaceholder(option)"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table v-loading="loading" :data="bookList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="isbn" label="ISBN号"></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="available" label="现存数量"></el-table-column>
      <el-table-column label="操作" width="300">
        <!--row 项 index 下标-->
        <template #default="{ row, $index }">
          <div style="display: flex">
            <el-button
              type="success"
              @click="borrowBook(row, $index)"
              :disabled="row.available === 0"
              >借阅图书</el-button
            >
            <el-button type="primary" @click="reserveBook(row, $index)"
              >预约图书</el-button
            >
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <BookBorrow ref="dialog" @success="onSuccess"></BookBorrow>
  </page-container>
</template>

<style lang="scss" scoped>
.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.select-box {
  width: 100px; /* 调整选择框的宽度 */
  margin-top: -17px;
}
</style>
