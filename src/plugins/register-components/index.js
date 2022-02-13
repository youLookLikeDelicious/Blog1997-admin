// 注册全局组件等
import Vue from 'vue'
import Select from '~/components/ui/select'
import Switch from '~/components/ui/switch'
import Input from '~/components/ui/v-input'
import umeditor from '@blog1997/vue-umeditor'
import VDialog from '~/components/slot/dialog'
import VHelper from '~/components/ui/v-helper'
import VButton from '~/components/ui/v-button'
import Avatar from '~/components/global/avatar'
import DropDown from '~/components/ui/drop-down'
import baseComponent from '~/components/slot/base'
import VCheckbox from '~/components/global/checkbox'
import CascadeSelect from '~/components/ui/cascade-select'
import promptMessage from '~/components/global/prompt-message'

Vue.use(umeditor)

Vue.use({
  install (Vue) {
    window.UMEDITOR_CONFIG.whiteList.script = ['src', 'onload']
    window.UMEDITOR_CONFIG.whiteList.div.push(...['v-for', ':key'])
    window.UMEDITOR_CONFIG.whiteList['transition-group'] = ['name', 'tag', 'class']
    window.UMEDITOR_CONFIG.whiteList.button = ['v-on:click']
    Vue.component('avatar', Avatar)
    Vue.component('v-input', Input)
    Vue.component('v-select', Select)
    Vue.component('v-switch', Switch)
    Vue.component('v-dialog', VDialog)
    Vue.component('v-helper', VHelper)
    Vue.component('v-button', VButton)
    Vue.component('v-checkbox', VCheckbox)
    Vue.component('v-drop-down', DropDown)
    Vue.component('CascadeSelect', CascadeSelect)
    Vue.component('prompt-message', promptMessage)
    Vue.component('base-component', baseComponent)
  }
})
