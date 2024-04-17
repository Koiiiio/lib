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
const pageSize = ref(5)

const getInstanceList = async (isbn) => {
  const res = await GetInstanceService(isbn)
  //InstanceList.value = res.data.data
  return res.data.data
}

const getBookList = async () => {
  loading.value = true
  const res = await GetBookService()
  // const res = await GetBookService({
  //   page: currentPage.value,
  //   pageSize: pageSize.value
  // })
  //bookList.value = res.data.data
  const tempBookList = res.data.data

  for (let i = 0; i < tempBookList.length; i++) {
    const book = tempBookList[i]
    const family = await getInstanceList(book.isbn)
    book.family = family
  }

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
    ElMessageBox.alert('此书正在被借阅中,不可删除!', '提示：', {
      confirmButtonText: 'OK'
    })
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

    <el-table v-loading="loading" :data="displayedBooks" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <div>
            Instance ISBN: {{ props.row.isbn }}
            <el-button
              type="primary"
              plain
              size="small"
              @click="onAddInstance(props.row.isbn)"
              style="margin-left: 30px"
              >图书入库</el-button
            >
          </div>

          <el-table :data="props.row.family">
            <el-table-column label="instanceId" prop="instanceId" width="170" />
            <el-table-column
              label="borrowStatus"
              prop="borrowStatus"
              width="170"
              ><template v-slot="scope">
                <span v-if="scope.row.borrowStatus === 0">未借阅</span>
                <span v-if="scope.row.borrowStatus === 1">已借阅</span>
              </template>
            </el-table-column>
            <el-table-column label="addTime" prop="addTime" width="200" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <div class="button-container" style="display: flex">
                  <el-button
                    type="danger"
                    size="small"
                    plain
                    @click="
                      onDelInstance(row.isbn, row.instanceId, row.borrowStatus)
                    "
                    >图书出库</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

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

    <BookEdit ref="dialog1" @success="onSuccess"></BookEdit>
    <Instance ref="dialog2" @success="onSuccess"></Instance>
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
</style>
