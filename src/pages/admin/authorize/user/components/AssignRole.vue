<template>
  <v-dialog title="分配角色" width="55rem" :visible.sync="dialogVisible" height="23rem" @confirm="submit">
    <el-form v-loading="loading" label-width="7rem">
      <el-row style="padding-left: 2.1rem; font-size: 1.4rem">
        <el-col :span="12">
          <el-form-item label="用户名">
            <span>{{userInfo.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱">
            {{userInfo.email}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="角色">
            <el-select v-model="model.roles" placeholder="请选择角色" size="mini" multiple clearable>
              <el-option v-for="role in roleList" :key="role.id" :value="role.id" :label="role.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import DialogBox from '~/components/global/dialog-box'

import { getRolesAll, getUserInfo } from '~/api/user'
import axios from 'axios'
export default {
  extends: DialogBox,
  data () {
    return {
      model: {
        roles: []
      },
      roleList: [],
      userInfo: '',
      loading: ''
    }
  },
  methods: {
    loadData () {
      this.loading = true
      axios.all([getRolesAll(), getUserInfo(this.id)])
        .then(axios.spread((roleList, userInfo) => {
          this.roleList = roleList.data.data
          this.userInfo = userInfo.data.data
          this.model.roles = this.userInfo.roles.map(role => role.id)
        }))
        .finally(() => {
          this.loading = false
        })
    },
    // 提交表单
    submit () {

    }
  }
}
</script>

<style>

</style>
