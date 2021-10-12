import store from '~/store'

function setMessage ({ msg = '', status = true }) {
  store.commit('globalState/setPromptMessage', {
    msg,
    status
  })
}

export default {
  install (Vue) {
    Vue.prototype.$setMessage = setMessage
  }
}
