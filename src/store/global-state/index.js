import { getCsrfToken } from '~/api/system'

// 全局组件 promptMessage的状态
const state = function () {
  return {
    prompt: [
      // {
      //   'message': '',
      //   'status': true
      // }
    ],
    waiting: false,
    hasCheckedUser: false,
    csrfToken: ''
  }
}

const mutations = {
  // 设置数据的状态
  setPromptMessage (state, { msg, status = true }) {
    state.prompt.push({
      message: msg,
      status,
      symbol: Symbol('message')
    })
  },
  shiftPromptMessage (state) {
    state.prompt.shift()
  },
  // 设置等待的状态
  setWaitingState (state, flag) {
    if (state.waiting === flag) {
      return
    }
    state.waiting = flag
  },
  checkedUser (state) {
    state.hasCheckedUser = true
  },
  // 设置令牌
  setCsrfToken (state, token) {
    state.csrfToken = token
  }
}

const actions = {
  GET_CSRF_TOKEN: ({ commit }) => {
    return getCsrfToken().then(res => {
      commit('setCsrfToken', res.data.data)
    })
  }
}

const namespaced = true

export default {
  state,
  namespaced,
  mutations,
  actions
}
