<script setup>
import { ref, computed, watch } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import {
  GetBookService,
  DelBookService,
  //AddInstanceService,
  //DelInstanceService
  GetInstanceService
} from '../../api/book.js'
import BookEdit from '../book/components/BookEdit.vue'
import Instance from '../book/components/Instance.vue'
const bookList = ref([])
const loading = ref(false)
const dialog1 = ref()
const dialog2 = ref()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const getBookList = async () => {
  loading.value = true
  const res = await GetBookService()
  // const res = await GetBookService({
  //   page: currentPage.value,
  //   pageSize: pageSize.value
  // })
  //bookList.value = res.data.data
  const tempBookList = res.data.data

  // for (let i = 0; i < tempBookList.length; i++) {
  //   const book = tempBookList[i]
  //   const family = await getInstanceList(book.isbn)
  //   book.family = family
  // }

  bookList.value = tempBookList
  total.value = bookList.value.length
  loading.value = false
}

getBookList()

//分页展示
const displayedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return bookList.value.slice(startIndex, endIndex)
})
const onEditBook = (isbn) => {
  dialog1.value.open(isbn)
}
const onAddBook = () => {
  dialog1.value.open({})
}

const onDelBook = async (row) => {
  await ElMessageBox.confirm('Are you sure you want to delete it?', 'Tip', {
    type: 'warning',
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  })
  await DelBookService(row.isbn)
  ElMessage.success('Successful Deletion')
  getBookList()
}
const onSuccess = (Isbn) => {
  getBookList()
  getInstanceList(Isbn)
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
    return 'Please enter the title'
  } else if (option === 'author') {
    return 'Please enter the author'
  } else if (option === 'isbn') {
    return 'Please enter the ISBN'
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

const onAddInstance = (isbn) => {
  dialog2.value.openIns(isbn, -1)
}

const onDelInstance = (isbn, instanceId, borrowStatus) => {
  if (borrowStatus === 1) {
    ElMessageBox.alert(
      'This book is currently on loan and cannot be deleted!',
      'Tip: ',
      {
        confirmButtonText: 'OK'
      }
    )
  } else {
    dialog2.value.openIns(isbn, instanceId)
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  getBookList()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  getBookList()
}
watch(option, (newValue) => {
  console.log(newValue)
  onReset()
})
const table = ref(false)
const Isbn = ref()
const openDrawer = (isbn) => {
  table.value = true
  Isbn.value = isbn
  getInstanceList(Isbn.value)
  console.log(InstanceList.value)
}
// const closeDrawer = () => {
//   table.value = false
// }
const InstanceList = ref([])
const getInstanceList = async (isbn) => {
  const res = await GetInstanceService(isbn)
  InstanceList.value = res.data.data
}
// const isOpen = ref(false) // Default collapsed state

// const toggleOpen = () => {
//   isOpen.value = !isOpen.value
// }
// const word = computed(() => {
//   if (isOpen.value === false) {
//     return '展开'
//   } else if (isOpen.value === true) {
//     return '收起'
//   } else {
//     return null
//   }
// })
</script>
<template>
  <page-container title="Book Catalog">
    <template #extra>
      <el-button @click="onAddBook">Add New Book</el-button>
    </template>
    <el-form inline>
      <div class="form-row">
        <el-select
          v-model="option"
          placeholder="Please Select"
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
      <el-table-column prop="author" label="Author"></el-table-column>
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
      <el-table-column
        prop="available"
        label="Number of existing"
      ></el-table-column>
      <el-table-column
        prop="borrowed"
        label="Number of borrowed"
      ></el-table-column>
      <el-table-column label="operation" width="250px">
        <!--row 项 index 下标-->
        <template #default="{ row, $index }">
          <div style="display: flex">
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
            <el-button @click="openDrawer(row.isbn)" type="primary" size="small"
              >List</el-button
            >
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No data"></el-empty>
      </template>
    </el-table>
    <el-drawer
      v-model="table"
      title="Instance table"
      direction="rtl"
      size="50%"
    >
      <div style="margin-bottom: 20px">
        Instance ISBN: {{ Isbn }}
        <el-button
          type="primary"
          plain
          size="small"
          @click="onAddInstance(Isbn)"
          style="margin-left: 30px"
          >Book Acquisition</el-button
        >
      </div>
      <div>
        <el-table :data="InstanceList">
          <el-table-column label="instanceId" prop="instanceId" />
          <el-table-column label="borrowStatus" prop="borrowStatus"
            ><template v-slot="scope">
              <span v-if="scope.row.borrowStatus === 0">Not borrowed</span>
              <span v-if="scope.row.borrowStatus === 1">Borrowed</span>
            </template>
          </el-table-column>
          <el-table-column label="addTime" prop="addTime" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <div class="button-container" style="display: flex">
                <el-button
                  type="danger"
                  size="small"
                  plain
                  @click="
                    onDelInstance(row.isbn, row.instanceId, row.borrowStatus)
                  "
                  >Book Withdrawal</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <BookEdit ref="dialog1" @success="onSuccess"></BookEdit>
    <Instance ref="dialog2" @success="onSuccess(Isbn)"></Instance>
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
  right: 20px;
  bottom: 10px;
}
*/
</style>
