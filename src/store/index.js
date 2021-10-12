import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import article from './article'
import globalState from './global-state'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    article,
    globalState
  }
})

export default store
