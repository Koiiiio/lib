<script setup>
import { ref, computed } from 'vue'
import { GetReserveList, CancelReserve, Reserve } from '../../api/book.js'
import BookBorrow from '../book/components/BookBorrow.vue'
const loading = ref(false)
const reserveList = ref([])
const getreserveList = async () => {
  loading.value = false //true
  const res = await GetReserveList()
  reserveList.value = res.data.data
  loading.value = false
}

getreserveList()
const Cancel = async (row) => {
  await ElMessageBox.confirm('Are you sure?', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
  await CancelReserve(row.isbn)
  ElMessage.success('Cancellation Successful!')
  getreserveList()
}
import defaultCover from '@/assets/defaultcover.jpg'
const getCoverImage = (cover) => {
  return cover ? `url(data:image/jpeg;base64,${cover})` : `url(${defaultCover})`
}
const isOpen = ref(false) // Default collapsed state

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
const word = computed(() => {
  if (isOpen.value === false) {
    return '展开'
  } else if (isOpen.value === true) {
    return '收起'
  } else {
    return null
  }
})
const dialog = ref()
const isbn = ref()
const borrowBook = (row) => {
  dialog.value.open(row)
  isbn.value = row.isbn
}
const handleRefresh = async () => {
  console.log('11')
  await Reserve(isbn.value)
  getreserveList()
}
</script>
<template>
  <page-container title="My Favorite">
    <el-table v-loading="loading" :data="reserveList" style="width: 100%">
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
      <el-table-column prop="author" label="Author"></el-table-column>
      <!-- <el-table-column prop="description" label="Description"
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
        label="Number of Existing"
      ></el-table-column>
      <el-table-column prop="location" label="Location"></el-table-column>
      <el-table-column
        prop="borrowed"
        label="Number of Borrowed"
      ></el-table-column>
      <el-table-column label="Operations" width="300">
        <!--row 项 index 下标-->
        <template #default="{ row, $index }">
          <div style="display: flex">
            <el-button type="primary" @click="Cancel(row, $index)"
              >Cancel
            </el-button>
            <el-button
              type="success"
              @click="borrowBook(row, $index)"
              :disabled="row.available === 0"
              >Borrow</el-button
            >
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No data"></el-empty>
      </template>
    </el-table>
    <BookBorrow ref="dialog" @refresh-list="handleRefresh(isbn)"></BookBorrow>
  </page-container>
</template>

<style lang="scss" scoped>
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
</style>
