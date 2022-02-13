import Vue from 'vue'

import './plugins'
import store from '~/store'
import AuthApp from './AuthApp'
import '~/assets/sass/app.scss'
import router from './router/auth'
import '~/plugins/register-components'
import animate from '@blog1997/animate'
import axios from '~/plugins/vendor/axios'
import '~/assets/sass/nprogress.scss'
import { loadProgressBar } from 'axios-progress-bar'

Vue.prototype.$animate = animate

Vue.use(axios)
loadProgressBar()
store.dispatch('globalState/GET_CSRF_TOKEN')
new Vue({
  store,
  router,
  render: h => h(AuthApp)
}).$mount('#app')
