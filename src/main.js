import './plugins'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import '~/assets/sass/app.scss'
import '~/assets/sass/el-element.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '~/assets/sass/nprogress.scss'
import { loadProgressBar } from 'axios-progress-bar'

// eslint-disable-next-line no-undef
Vue.prototype.RSA_PUB_KEY = RSA_PUB_KEY
Vue.use(ElementUI)
loadProgressBar()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
