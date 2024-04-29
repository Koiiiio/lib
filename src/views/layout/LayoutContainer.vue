<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  Service,
  MessageBox,
  Finished,
  Edit,
  Timer,
  Stamp,
  ChatDotRound
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
//import { userGetInfoService } from '../../api/user.js'
const userStore = useUserStore()

const router = useRouter()

onMounted(() => {
  userStore.getUser()
})

const handleCommand = async (key) => {
  if (key === 'logout') {
    await ElMessageBox.confirm('Are you sure you want to quit?', 'Tip', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    router.push(`/user/${key}`)
  }
}
// const mode = ref(false)
// const switchMode = () => {
//   mode.value = !mode.value
//   console.log(mode.value)
// }
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="250px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/book/channel">
          <el-icon><Management /></el-icon>
          <span>Book Catalog</span>
        </el-menu-item>
        <el-menu-item index="/book/manage">
          <el-icon><Finished /></el-icon>
          <span>Borrowings</span>
        </el-menu-item>
        <!-- <el-menu-item index="/book/reserve" v-if="mode"> -->
        <el-menu-item index="/book/reserve">
          <el-icon><ChatDotRound /></el-icon>
          <span>Reservations</span>
        </el-menu-item>
        <!-- <el-menu-item index="/book/penalty" v-if="mode"> -->
        <el-menu-item index="/book/penalty">
          <el-icon><Stamp /></el-icon>
          <span>Penalties</span>
        </el-menu-item>
        <el-sub-menu
          index="/manager"
          v-if="userStore.user.userRole === 'admin'"
        >
          <template #title>
            <el-icon><Service /></el-icon>
            <span>Librarian Operations</span>
          </template>

          <!-- <el-menu-item index="/manager/usermanage" v-if="mode"> -->
          <el-menu-item index="/manager/usermanage">
            <el-icon><Edit /></el-icon>
            <span>Unreturned Borrowings</span>
          </el-menu-item>
          <el-menu-item index="/manager/bookmanage">
            <el-icon><MessageBox /></el-icon>
            <span>Book Management</span>
          </el-menu-item>
          <!-- <el-menu-item index="/manager/request">
            <el-icon><Promotion /></el-icon>
            <span>Borrowing Requests</span>
          </el-menu-item> -->
          <!-- <el-menu-item index="/manager/latereturn">
            <el-icon><Timer /></el-icon>
            <span>Late Return Requests</span>
          </el-menu-item> -->
          <el-menu-item index="/scancode">
            <el-icon><EditPen /></el-icon>
            <span>Scan</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>Profile</span>
          </template>
          <el-menu-item index="/user/avatar">
            <el-icon><User /></el-icon>
            <span>Change Avatar</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><Crop /></el-icon>
            <span>Change Password</span>
          </el-menu-item>
          <el-menu-item index="/user/profile">
            <el-icon><EditPen /></el-icon>
            <span>Personal Info</span>
          </el-menu-item>
          <el-menu-item index="/user/bill">
            <el-icon><EditPen /></el-icon>
            <span>Bill</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          User: <strong>{{ userStore.user.username }}</strong>
        </div>
        <div>
          User Role:
          <strong v-if="userStore.user.userRole === 'admin'">Librarian</strong>
          <strong v-if="userStore.user.userRole === 'user'">Reader</strong>
        </div>
        <!-- <el-button plain @click="switchMode">DAMN</el-button> -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!--默认展示-->
          <span class="el-dropdown__box">
            <!-- <el-avatar :src="userStore.user.avatar || avatar" /> -->
            <el-avatar
              :src="'data:image/jpeg;base64,' + userStore.user.avatar || avatar"
            />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!--下拉-->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >Basic Info</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >Change Avatar</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >Reset Password</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >Logout</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>LMS ©2024 Created by XDU</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.jpg') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
