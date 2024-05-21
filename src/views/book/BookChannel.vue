<script setup>
import { ref, computed, watch } from 'vue'
import { GetBookService, Reserve, SearchBookService } from '../../api/book.js'
import {} from '@element-plus/icons-vue'
import BookBorrow from '../book/components/BookBorrow.vue'
import { ElMessage } from 'element-plus'
const bookList = ref([])
const loading = ref(false)

const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)

const getBookList = async () => {
  loading.value = true //true
  const res = await GetBookService()
  bookList.value = res.data.data
  total.value = bookList.value.length
  loading.value = false
}
const getSearchList = async ({ method, keyword }) => {
  loading.value = true //true
  const res = await SearchBookService({ method: method, keyword: keyword })
  bookList.value = res.data.data
  total.value = bookList.value.length
  loading.value = false
}
//分页展示
const displayedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return bookList.value.slice(startIndex, endIndex)
})
getBookList()
const onSuccess = () => {
  getBookList()
}
const search1 = ref('')

const onSearch = () => {
  currentPage.value = 1
  if (option.value === 'title') {
    getSearchList({ method: 'title', keyword: search1.value })
  } else if (option.value === 'author') {
    //return book.author.includes(search1.value)
    getSearchList({ method: 'author', keyword: search1.value })
  } else if (option.value === 'isbn') {
    //return book.isbn.includes(search1.value)
    getSearchList({ method: 'isbn', keyword: search1.value })
  }
}

const onReset = () => {
  search1.value = ''
  currentPage.value = 1
  getBookList()
}

const options = ref([
  {
    value: 'title',
    label: 'Title'
  },
  {
    value: 'author',
    label: 'Author'
  },
  {
    value: 'isbn',
    label: 'ISBN'
  }
])
const option = ref('title')
const setPlaceholder = (option) => {
  if (option === 'title') {
    return 'Please enter the book title'
  } else if (option === 'author') {
    return 'Please enter the book author'
  } else if (option === 'isbn') {
    return 'Please enter the ISBN'
  }
}

const dialog = ref()
const borrowBook = (row) => {
  dialog.value.open(row)
}
const handleRefresh = () => {
  getBookList() // 这里调用获取图书列表的方法，进行刷新
}
const reserveBook = async (row) => {
  await ElMessageBox.confirm('Are you sure?', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'Warning'
  })
  //console.log(row.isbn)
  const res = await Reserve(row.isbn)
  //console.log(res)
  if (res.data.code == 200) ElMessage.success('Successful Star!')
}
watch(option, (newValue) => {
  console.log(newValue)
  onReset()
})
import defaultCover from '@/assets/defaultcover.jpg'

const getCoverImage = (cover) => {
  return cover ? `url(data:image/jpeg;base64,${cover})` : `url(${defaultCover})`
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  getBookList()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  if (search1.value === '') getBookList()
  else getSearchList({ method: option.value, keyword: search1.value })
}
</script>

<template>
  <page-container title="Book Catalog">
    <el-form inline>
      <div class="form-row">
        <el-select
          v-model="option"
          placeholder="Please select"
          class="select-box"
        >
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
          <el-button type="primary" @click="onSearch">Search</el-button>
          <el-button @click="onReset">Reset</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table v-loading="loading" :data="displayedBooks" style="width: 100%">
      <el-table-column type="index" label="No" width="100"></el-table-column>
      <el-table-column prop="cover" label="Cover">
        <template #default="{ row }">
          <div
            class="thumbnail"
            :style="{
              'background-image': getCoverImage(row.cover)
            }"
          ></div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="Title"></el-table-column>
      <el-table-column prop="isbn" label="ISBN"
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
      <el-table-column prop="description" label="Description "
        ><template #default="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            placement="bottom"
            :content="row.description"
          >
            <div class="ellipsis">
              {{ row.description }}
            </div>
          </el-tooltip>
        </template></el-table-column
      >
      <!-- <el-table-column prop="description" label="Description "
        ><template #default="{ row }">
          <div :class="isOpen ? 'new_detail' : 'default'">
            <span class="font999">{{ row.description }}</span>
          </div>
          <el-button type="text" class="popper-btn" @click="toggleOpen"
            >{{ word
            }}<i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i
          ></el-button> </template
      ></el-table-column> -->
      <el-table-column prop="author" label="Author"></el-table-column>
      <el-table-column
        prop="available"
        label="Number of Existing"
      ></el-table-column>
      <el-table-column prop="location" label="Location"></el-table-column>
      <el-table-column label="Operation" width="300">
        <!--row 项 index 下标-->
        <template #default="{ row, $index }">
          <div style="display: flex">
            <el-button
              type="success"
              @click="borrowBook(row, $index)"
              :disabled="row.available === 0"
              >Borrow</el-button
            >
            <el-button type="primary" @click="reserveBook(row, $index)"
              >Star</el-button
            >
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No data"></el-empty>
      </template>
    </el-table>

    <BookBorrow
      ref="dialog"
      @success="onSuccess"
      @refresh-list="handleRefresh"
    ></BookBorrow>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
.pagination {
  float: right;
  margin-top: 12px;
}
.thumbnail {
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap; /* 不换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  max-width: 150px; /* 设置最大宽度，根据需要调整 */
}
/*
.new_detail {
  padding: 5px 50px 5px 0;
  font-size: 14px;
}
.default {
  padding: 5px 50px 5px 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.popper-btn {
  position: absolute;
  right: 15px;
  bottom: 40px;
}
*/
</style>
