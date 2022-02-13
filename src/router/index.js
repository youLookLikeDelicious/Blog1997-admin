import Vue from 'vue'
import store from '../store'
import { can } from '~/plugins/tool/auth'

import BaseLayout from '~/layout/base-layout'
import Index from '../pages/admin'
import VueRouter from 'vue-router'
import ArticleList from '~/pages/admin/article'
import ArticleCreate from '~/pages/admin/article/create'
import TopicList from '~/pages/admin/article/topic/index'
import TagList from '~/pages/admin/article/tag/index'
import Published from '~/pages/admin/published'

import Gallery from '~/pages/admin/gallery'
import Album from '~/pages/admin/gallery/album'
import AlbumList from '~/components/gallery/album/list'
import FriendLink from '~/pages/admin/friend-link'
import Report from '~/pages/admin/message/report'
import VerifyComments from '~/pages/admin/message/comments'
import Notification from '~/pages/admin/message/notification'

import SensitiveWord from '~/pages/admin/sensitive-word'
import SensitiveWordCategory from '~/components/sensitive-word/category'
import SensitiveWordIndex from '~/components/sensitive-word'

import Manager from '~/pages/admin/authorize/manager'
import Auth from '~/pages/admin/authorize/auth'
import Role from '~/pages/admin/authorize/role'
import User from '~/pages/admin/authorize/user'

import Setting from '~/pages/admin/system/setting'
import UserLog from '~/pages/admin/system/user-log'
import ScheduleLog from '~/pages/admin/system/schedule-log'

import Profile from '~/pages/admin/profile'

import PermissionDeny from '~/pages/admin/401'
import NotFound from '~/pages/admin/404'

import {
  axios
} from '~/plugins/vendor/axios'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Index',
  components: {
    default: Index
  },
  meta: {
    permission: 'admin.dashboard'
  }
},
// 文章相关路由
{
  path: '/article',
  component: BaseLayout,
  children: [{
    path: 'create/:id?',
    component: ArticleCreate,
    name: 'article.create',
    meta: {
      permission: 'article.create,article.store'
    }
  }, {
    path: 'topic',
    component: TopicList,
    name: 'article.topic',
    meta: {
      permission: 'topic.store'
    }
  }, {
    path: 'tag',
    component: TagList,
    name: 'article.tag',
    meta: {
      permission: 'tag.index'
    }
  }, {
    path: ':id?',
    component: ArticleList,
    name: 'article.list',
    meta: {
      permission: 'article.create,article.store'
    }
  }]
}, {
  path: '/published',
  name: 'published',
  component: Published,
  beforeEnter: (to, from, next) => {
    if (store.state.article.publishedId) {
      return next()
    }
    next({
      path: '/'
    })
  }
}, {
  // 相册路由
  path: '/gallery',
  name: 'gallery',
  component: Gallery,
  meta: {
    permission: 'gallery.index'
  }
}, {
  path: '/gallery/album',
  component: Album,
  meta: {
    permission: 'gallery.index'
  },
  children: [
    {
      path: '',
      component: AlbumList,
      name: 'Album'
    },
    {
      path: ':id',
      component: Gallery,
      name: 'AlbumGallery',
      props: true
    }
  ]
}, {
  path: '/gallery/place',
  name: 'albumPlace',
  component: () => import('@/pages/admin/gallery/place'),
  meta: {
    permission: 'gallery.index'
  }
}, {
  path: '/friend-link',
  name: 'friendLink',
  component: FriendLink,
  meta: {
    permission: 'friend-link.index'
  }
}, {
  path: '/message',
  component: BaseLayout,
  children: [{
    path: 'illegal-info',
    component: Report,
    meta: {
      permission: 'illegal-info.index'
    }
  }, {
    path: 'comments',
    component: VerifyComments,
    meta: {
      permission: 'comment.index'
    }
  }, {
    path: 'notification',
    component: Notification,
    meta: {
      permission: 'notification.index'
    }
  }]
}, {
  path: '/sensitive-word',
  component: SensitiveWord,
  children: [{
    path: 'category',
    component: SensitiveWordCategory,
    meta: {
      permission: 'sensitive-word-category.index'
    }
  }, {
    path: ':id?',
    component: SensitiveWordIndex,
    meta: {
      permission: 'sensitive-word.index'
    }
  }]
}, {
  path: '/manager',
  component: Manager
}, {
  path: '/auth',
  component: Auth,
  meta: {
    permission: 'auth.index'
  }
}, {
  path: '/user',
  component: User,
  meta: {
    // permission: 'user.index'
  }
}, {
  path: '/role',
  component: Role,
  meta: {
    permission: 'role.index'
  }
}, {
  path: '/system/setting',
  component: Setting,
  meta: {
    permission: 'system-setting.index'
  }
}, {
  path: '/system/user-log',
  component: UserLog,
  meta: {
    permission: 'system.log'
  }
}, {
  path: '/system/schedule-log',
  component: ScheduleLog,
  meta: {
    permission: 'system.log'
  }
}, {
  path: '/profile/:type?',
  component: Profile,
  meta: {
    permission: 'user.profile'
  }
}, {
  path: '/manual',
  component: BaseLayout,
  // meta: { permission: 'manual.index' },
  children: [
    {
      path: '',
      component: () => import('@/pages/admin/manual')
    }, {
      path: ':id',
      component: () => import('@/pages/admin/manual/manual-info')
    }, {
      path: ':manual_id/article/:id?',
      name: 'manual-article',
      component: () => import('@/pages/admin/manual/create-article')
    }
  ]
}, {
  path: '/401',
  component: PermissionDeny
}, {
  path: '*',
  component: NotFound
}
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.VUE_BASE_URL
  routes
})

/**
 * 重定向到登陆页面
 */
const redirectToLogin = () => {
  window.location.replace('/login')
}

// 为路由设置前置守卫
router.beforeEach(async (to, from, next) => {
  // 用户的状态已经初始化过
  let user = await checkCurrentUser()

  if (user instanceof Error) {
    user = ''
  }

  if (!user) {
    next(false)
    return redirectToLogin()
  }

  if (!checkAuthority(to)) {
    return next('/401')
  }

  specifyLayoutAndTile(to)
  next()
})

/**
 * 判断用户是否登陆
 *
 * @return {Promise}
 */
function checkCurrentUser () {
  return new Promise((resolve, reject) => {
    if (store.state.user.initialized) {
      resolve(store.state.user.id)
    } else {
      // 1、尝试获取当前的用户
      store.dispatch('globalState/GET_CSRF_TOKEN').then(() => {
        axios.post('/oauth/currentUser')
          .then((response) => {
            if (response.data.data) {
              store.commit('user/setUser', response.data.data)
            }
            resolve(response.data.data)
          })
          .catch(() => {
            resolve('')
          })
      })
    }
  })
}

/**
 * 指定title和layout
 *
 * @param {Route} to
 * @return {void}
 */
async function specifyLayoutAndTile (to) {
  // 判断路由组件是否定义模板，如果式，将模板添加到meta中
  if (!to.matched.length) return
  let component = to.matched[to.matched.length - 1].components.default
  if (typeof component === 'function') {
    const { default: _ } = await component()
    component = _
  }

  const { layout = 'default', title = process.env.TITLE } = component
  to.meta.layout = layout

  const currentTitle = document.head.querySelector('title').innerHTML

  if (currentTitle !== title) {
    setTitle(title)
  }
  // to.matched.some(record => {
  // })
}

/**
 * 检查用户权限
 * @param {Route} to
 * @return {boolean}
 */
function checkAuthority (to) {
  if (!to.meta.permission) {
    return true
  }

  return can(to.meta.permission)
}

/**
 * 设置页面的title
 * @param {string} title
 */
function setTitle (title = '') {
  document.head.querySelector('title').innerHTML = title
}
export {
  redirectToLogin
}

export default router
