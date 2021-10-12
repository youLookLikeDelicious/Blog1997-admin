<template>
  <!-- 友情链接的列表信息 -->
  <div>
    <table class="system-basic-setting">
      <tr>
        <td>开启评论</td>
        <td>
          <v-switch v-model="model.enable_comment" left-value="yes" right-value="no"  @click="setting" />
        </td>
      </tr>
      <tr>
        <td>审核评论</td>
        <td>
          <v-switch :disable="!model.enable_comment" v-model="model.verify_comment" left-value="yes" right-value="no" @click="setting" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import CompareOriginmodelMixin from '~/mixin/compare-origin-model'
import SettingMixin from '~/mixin/setting'
import { getSystemSetting, updateSystemSetting } from '~/api/system'
export default {
  name: 'BasicSetting',
  mixins: [CompareOriginmodelMixin, SettingMixin],
  data () {
    return {
      model: {
        enable_comment: '',
        verify_comment: ''
      },
      originModel: {

      }
    }
  },
  created () {
    this.getSetting()
  },
  methods: {
    getSetting () {
      getSystemSetting()
        .then(this.responseCallback)
    },
    /**
     * 发送修改请求
     *
     * @return {void}
     */
    setting () {
      updateSystemSetting(this.model.id, this.model)
        .catch(() => this.restore())
    }
  }
}
</script>

<style lang="scss">
</style>
