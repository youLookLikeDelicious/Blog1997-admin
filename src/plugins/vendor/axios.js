import axios from 'axios'
import store from '~/store'
import router from '~/router'

axios.defaults.withCredentials = true
// eslint-disable-next-line no-undef
axios.defaults.baseURL = VUE_APP_BASE_URL
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const requestStack = []
/**
 * 所有请求 都结束的时候，才取消等待动画
 */
const hidWaitingAnimation = () => {
  requestStack.pop()
  if (requestStack.length) {

  }
  // store.commit('globalState/setWaitingState', false)
}

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  if (process.browser) {
    const message = response.data.message
    if (message !== 'success') {
      store.commit('globalState/setPromptMessage', { msg: message, status: true })
    }
    // 取消等待动画
    hidWaitingAnimation()
  }

  return response
}, function (error) {
  const { response } = error
  // 在客户端
  if (process.browser && response) {
    // 用户登录信息异常
    // 展示登录对话框
    // 清空store用户信息
    let errorMessage = ''

    try {
      errorMessage = Object.values(response.data.message).map(item => item.join('\n')).join('\n')
    } catch {
      errorMessage = response.data.message || '未知错误'
    }

    store.commit('globalState/setPromptMessage', { msg: errorMessage, status: false }, { root: true })

    if (response.status === 401) {
      store.commit('user/setUser', {})
      router.push('/401')
    }
    // 设置提示消息
    // 取消等待动画
  }

  hidWaitingAnimation()
  return Promise.reject(error)
})

// 如果在客户端中进行请求，开启等待动画
axios.interceptors.request.use(function (config) {
  if (process.browser && config.url !== '/csrf') {
    requestStack.push(1)
    // store.commit('globalState/setWaitingState', true)
  }

  if (!config.params) {
    config.params = {}
  }
  config.params._token = store.state.globalState.csrfToken
  return config
}, function (error) {
  return Promise.reject(error)
})

export { axios }
export default {
  install (Vue) {
    Vue.prototype.$axios = axios
  }
}
