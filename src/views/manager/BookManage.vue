<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import {
  GetBookService,
  DelBookService
  //AddInstanceService,
  //DelInstanceService
} from '../../api/book.js'
import BookEdit from '../book/components/BookEdit.vue'

const bookList = ref([])
const loading = ref(false)
const dialog = ref()

const getBookList = async () => {
  loading.value = true
  const res = await GetBookService()
  bookList.value = res.data.data
  //console.log(bookList.value)
  loading.value = false
}

getBookList()

const onEditBook = (row) => {
  dialog.value.open(row)
}
const onAddBook = () => {
  dialog.value.open({})
}

const onDelBook = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗?', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await DelBookService(row.isbn)
  ElMessage.success('删除成功')
  getBookList()
}
const onSuccess = () => {
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
const option = ref('')
const setPlaceholder = (option) => {
  if (option === 'title') {
    return '请输入图书标题'
  } else if (option === 'author') {
    return '请输入图书作者'
  } else if (option === 'isbn') {
    return '请输入ISBN号'
  }
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

const onAddInstance = () => {
  console.log('add')
}

const onDelInstance = () => {
  console.log('del')
}
</script>
<template>
  <page-container title="图书目录">
    <template #extra>
      <el-button @click="onAddBook">添加新图书</el-button>
    </template>
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
      <el-table-column type="expand">
        <template v-slot="props">
          <div class="expand-container">
            <div class="isbn-container">
              <span>ISBN号: {{ props.row.isbn }}</span>
            </div>
            <div class="button-container">
              <el-button
                type="primary"
                plain
                size="small"
                @click="onAddInstance()"
                >添加图书</el-button
              >
              <el-button
                type="danger"
                size="small"
                plain
                @click="onDelInstance()"
                >删除图书</el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="isbn" label="ISBN号"></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="available" label="现存数量"></el-table-column>
      <el-table-column prop="borrowed" label="被借阅数量"></el-table-column>
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

.expand-container {
  display: flex;
  justify-content: space-between;
}

.isbn-container {
  flex-grow: 1;
  margin-left: 50px;
}

.button-container {
  margin-left: 10px; /* 调整按钮之间的间距 */
}
</style>
