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
          path: '/bookmanage',
          component: () => import('@/views/book/BookManage.vue')
        },
        {
          path: '/bookreserve',
          component: () => import('@/views/book/BookReserve.vue')
        },
        {
          path: '/bookchannel',
          component: () => import('@/views/book/BookChannel.vue')
        },
        {
          path: '/bookpenalty',
          component: () => import('@/views/book/Penalty.vue')
        },
        {
          path: '/managerrequest',
          component: () => import('@/views/manager/RequestHandle.vue')
        },
        {
          path: '/managerusermanage',
          component: () => import('@/views/manager/UserManage.vue')
        },
        {
          path: '/managerbookmanage',
          component: () => import('@/views/manager/BookManage.vue')
        },
        {
          path: '/managerlatereturn',
          component: () => import('@/views/manager/LateReturn.vue')
        },
        {
          path: '/userprofile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/useravatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/userpassword',
          component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/userbill',
          component: () => import('@/views/user/UserBill.vue')
        },
        {
          path: '/scancode',
          component: () => import('@/views/Camera.vue')
        },
        {
          path: '/chat',
          component: () => import('@/views/Chat.vue')
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
