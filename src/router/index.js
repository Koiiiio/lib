import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/book/manage',
      children: [
        {
          path: '/book/manage',
          component: () => import('@/views/book/BookManage.vue')
        },
        {
          path: '/book/channel',
          component: () => import('@/views/book/BookChannel.vue')
        },
        {
          path: '/manager/RequestHandle',
          component: () => import('@/views/manager/RequestHandle.vue')
        },
        {
          path: '/manager/UserManage',
          component: () => import('@/views/manager/UserManage.vue')
        },
        {
          path: '/manager/BookManage',
          component: () => import('@/views/manager/BookManage.vue')
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
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'

  return true
})

export default router
