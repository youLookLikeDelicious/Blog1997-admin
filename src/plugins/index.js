/* eslint-disable import/first */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import '~/config/app-config.js'
import Vue from 'vue'
import animate from './vendor/animate'
import axios from './vendor/axios'
import imagePreview from './vendor/image-preview'
import initFormula from './vendor/init-formula'

import helper from './tool/helper'
import compareArray from './tool/compare-array'
import checkElementAncestor from './tool/check-element-ancestors'

import { hideCascader } from '../utils/utils'

import './register-components'
import './filters'
import Verify from './verify'
import auth from './tool/auth'
import lazy from './tool/lazy-load'
import jsonToFormData from './tool/json-2-formdata'

Vue.use(animate)
Vue.use(axios)
Vue.use(imagePreview)
Vue.use(initFormula)
Vue.use(helper)
Vue.use(checkElementAncestor)
Vue.use(compareArray)
Vue.use(Verify)
Vue.use(auth)
Vue.use(lazy)
Vue.use(jsonToFormData)

Vue.use({
  install (vue) {
    vue.prototype.$hideCascader = hideCascader
    Vue.prototype.TITLE = config.VUE_TITLE || TITLE
    Vue.prototype.APP_URL = config.VUE_APP_URL || APP_URL
    Vue.prototype.API_URL = config.VUE_API_URL || API_URL
    Vue.prototype.RSA_PUB_KEY = config.VUE_RSA_PUB_KEY || RSA_PUB_KEY
    Vue.prototype.WECHAT_APP_ID = config.VUE_WECHAT_APP_ID || WECHAT_APP_ID
    Vue.prototype.GIT_CLIENT_ID = config.VUE_GIT_CLIENT_ID || GIT_CLIENT_ID
  }
})

console.info(`%c
________  ___       ________  ________    _____  ________  ________  ________  
|\\   __  \\|\\  \\     |\\   __  \\|\\   ____\\  / __  \\|\\  ___  \\|\\  ___  \\|\\_____  \\ 
\\ \\  \\|\\ /\\ \\  \\    \\ \\  \\|\\  \\ \\  \\___| |\\/_|\\  \\ \\____   \\ \\____   \\\\|___/  /|
 \\ \\   __  \\ \\  \\    \\ \\  \\\\\\  \\ \\  \\  __\\|/ \\ \\  \\|____|\\  \\|____|\\  \\   /  / /
  \\ \\  \\|\\  \\ \\  \\____\\ \\  \\\\\\  \\ \\  \\|\\  \\   \\ \\  \\  __\\_\\  \\  __\\_\\  \\ /  / / 
   \\ \\_______\\ \\_______\\ \\_______\\ \\_______\\   \\ \\__\\|\\_______\\|\\_______/__/ /  
    \\|_______|\\|_______|\\|_______|\\|_______|    \\|__|\\|_______|\\|_______|__|/

                                                                ©2022 chaos
                                                                                `, 'color: #00AEEC')
