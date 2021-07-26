import Vue from 'vue'
import VueRouter from 'vue-router'

import { getLs } from '../tool/storage'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    component: () => import('../views/login/Index')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const notAuth = ['/login']
  const { path } = to
  if (!notAuth.includes(path)) {
    const token = getLs('token')
    if (!token) {
      return next('/login')
    }
  }
  next()
})

export default router
