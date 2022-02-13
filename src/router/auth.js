import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '~/pages/login/login'
import register from '~/pages/login/register'
import PasswordRest from '~/pages/login/password-reset'

Vue.use(VueRouter)

/**
 * 后台权限相关的路由
 */
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: login
  }, {
    path: '/manager/register',
    name: 'Register',
    component: register
  }, {
    path: '/password/reset',
    name: 'PasswordRest',
    component: PasswordRest
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
