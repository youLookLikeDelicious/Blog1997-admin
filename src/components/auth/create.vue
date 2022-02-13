<template>
  <v-dialog
    width="52rem"
    height="30rem"
    :title="id ? '编辑权限' : '添加权限'"
    :visible.sync="dialogVisible"
    @close="closeCallback"
    @confirm="submit"
  >
    <el-form ref="form" :model="model" :rules="rules" v-loading="loading" label-position="right" label-width="12rem">
      <el-row>
        <el-col>
          <el-form-item label="名称" prop="name">
            <v-input v-model="model.name" placeholder="请填写权限名称" style="width: 33rem"></v-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="路由名称" prop="route_name">
            <v-input v-model="model.route_name" placeholder="请填写路由名称" style="width: 33rem"></v-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="父级权限" prop="parent_id">
            <el-cascader
              ref="cascader"
              v-model="model.parent_id"
              size="mini"
              :options="authList"
              :props="{ children: 'child', checkStrictly: true, emitPath: false, label: 'name', value: 'id', expandTrigger: 'hover' }"
              clearable
              @change="$hideCascader($refs.cascader)"
              style="width: 33rem">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import convertChildren from '~/plugins/tool/convert-child'
import DialogBox from '~/components/global/dialog-box'
import { getAuthAll, getAuthInfo } from '~/api/auth'

export default {
  name: 'CreateAuth',
  extends: DialogBox,
  data () {
    return {
      model: {
        name: '',
        parent_id: '',
        route_name: ''
      },
      rules: {
        name: { required: true, message: '请填写权限名称', trigger: 'change' }
      },
      authList: []
    }
  },
  methods: {
    /**
     * 提交表单
     *
     * @return void
     */
    submit () {
      this.$emit('create', this.$json2FormData(this.model), this.id)
    },
    getOriginModel (id) {
      getAuthInfo(id).then(res => {
        this.model = res.data.data
      })
    },
    loadData () {
      this.loading = true
      getAuthAll().then(res => {
        convertChildren(res.data.data, this.id)
        this.authList = res.data.data
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 图标的点击事件
     *
     * @param {HTMLEvent} e
     */
    selectIcon (e) {
      this.model.icon =
        this.model.icon === e.target.className ? '' : e.target.className
    }
  }
}
</script>

<style lang="scss">
.create-auth {
  box-shadow: unset !important;
  tr {
    &:hover {
      background-color: inherit !important;
    }
    td {
      &:first-child {
        width: 12rem;
        text-align: right !important;
      }
      &:last-child {
        text-align: left !important;
      }
    }
    .v-input-inline {
      width: 21rem;
    }
  }
  .url-input {
    padding-left: 0.7rem;
    margin-top: 0.2rem;
  }
}
</style>
