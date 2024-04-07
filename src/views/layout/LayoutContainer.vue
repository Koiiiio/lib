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
  Edit
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
//import { userGetInfoService } from '../../api/user.js'
const userStore = useUserStore()
const router = useRouter()
const isRoot = ref(true)
//const role = userGetInfoService()
//if (role.data.data.userRole.value == 'admin') isRoot.value = true
onMounted(() => {
  userStore.getUser()
})
const handleCommand = async (key) => {
  if (key === 'logout') {
    await ElMessageBox.confirm('你确定要退出吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    router.push(`/user/${key}`)
  }
}
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
          <span>图书目录</span>
        </el-menu-item>
        <el-menu-item index="/book/manage">
          <el-icon><Finished /></el-icon>
          <span>查看借阅</span>
        </el-menu-item>
        <el-menu-item index="/book/reserve">
          <el-icon><Finished /></el-icon>
          <span>查看预约</span>
        </el-menu-item>
        <el-menu-item index="/book/penalty">
          <el-icon><Finished /></el-icon>
          <span>查看处分</span>
        </el-menu-item>
        <el-sub-menu index="/manager" v-if="isRoot">
          <template #title>
            <el-icon><Service /></el-icon>
            <span>管理员功能</span>
          </template>

          <el-menu-item index="/manager/usermanage">
            <el-icon><Edit /></el-icon>
            <span>查看未归还读者</span>
          </el-menu-item>
          <el-menu-item index="/manager/bookmanage">
            <el-icon><MessageBox /></el-icon>
            <span>书籍管理</span>
          </el-menu-item>
          <el-menu-item index="/manager/request">
            <el-icon><Promotion /></el-icon>
            <span>查看借阅申请</span>
          </el-menu-item>
          <el-menu-item index="/manager/latereturn">
            <el-icon><Promotion /></el-icon>
            <span>查看迟还申请</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/avatar">
            <el-icon><User /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><Crop /></el-icon>
            <span>修改密码</span>
          </el-menu-item>
          <el-menu-item index="/user/profile">
            <el-icon><EditPen /></el-icon>
            <span>个人资料</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          用户：<strong>{{ userStore.user.username }}</strong>
        </div>
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
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>图书管理系统 ©2024 Created by XDU</el-footer>
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
