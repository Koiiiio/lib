import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/login',
      children: [
        {
          path: '/book/manage',
          component: () => import('@/views/book/BookManage.vue')
        },
        {
          path: '/book/reserve',
          component: () => import('@/views/book/BookReserve.vue')
        },
        {
          path: '/book/channel',
          component: () => import('@/views/book/BookChannel.vue')
        },
        {
          path: '/book/penalty',
          component: () => import('@/views/book/Penalty.vue')
        },
        {
          path: '/manager/request',
          component: () => import('@/views/manager/RequestHandle.vue')
        },
        {
          path: '/manager/usermanage',
          component: () => import('@/views/manager/UserManage.vue')
        },
        {
          path: '/manager/bookmanage',
          component: () => import('@/views/manager/BookManage.vue')
        },
        {
          path: '/manager/latereturn',
          component: () => import('@/views/manager/LateReturn.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/user/bill',
          component: () => import('@/views/user/UserBill.vue')
        }
      ]
    },
    { path: '/scancode', component: () => import('@/views/Camera.vue') }
  ]
})

router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'

  return true
})

export default router
