<template>
  <v-dialog
    :visible.sync="dialogVisible"
    width="74rem"
    height="63rem"
    :title="id ? '编辑角色' : '创建角色'"
    @close="close"
    @confirm="submit"
  >
    <el-form ref="form" :model="model" :rules="rules" v-loading="loading" label-position="right" label-width="10rem" style="padding: 2.4rem 3.4rem 1.2rem 0">
      <el-row :gutter="8">
        <el-col>
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="model.name" placeholder="角色名称" size="mini" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="model.remark" placeholder="备注" size="mini" :autosize="{ minRows: 3 }"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="权限">
            <auth-tree ref="tree" :tree="authList" :default-checked="model.authorities"></auth-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import AuthTree from './tree'
import { getAuthAll, getRoleInfo } from '~/api/auth'
import DialogBox from '~/components/global/dialog-box'
import convertChild from '~/plugins/tool/convert-child'

export default {
  name: 'CreateRole',
  extends: DialogBox,
  components: {
    AuthTree
  },
  data () {
    return {
      authList: [],
      model: {
        name: '',
        remark: '',
        authorities: []
      },
      rules: {
        name: { required: true, message: '请输入角色名称', trigger: 'blur' }
      },
      loading: false
    }
  },
  methods: {
    /**
     * 提交表单
     *
     * @reutrn void
     */
    submit () {
      this.$refs.form.validate()
        .then(() => {
          const model = { ...this.model, authorities: this.$refs.tree.getCheckedValus() }

          this.$emit('create', model, this.id)
        })
    },
    loadData () {
      this.loading = true
      getAuthAll().then(res => {
        const data = res.data.data
        convertChild(data)
        this.authList = data
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取角色详情
    getOriginModel (id) {
      getRoleInfo(id)
        .then(res => res.data.data)
        .then(res => {
          this.model = {
            name: res.name,
            remark: res.remark,
            authorities: res.authorities.map(item => item.id)
          }
        })
    },
    /**
     * 关闭对话框事件
     */
    close () {
      this.authList = []
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
.create-role {
  box-shadow: unset !important;
  tr {
    &:hover {
      background-color: inherit !important;
    }
    td {
      vertical-align: top;
      &:first-child {
        width: 12rem;
        text-align: right !important;
      }
      &:last-child {
        text-align: left !important;
      }
    }
  }
  textarea{
    width: 17rem;
    height: 7rem;
    border: 0.1rem solid #c6c6c6;
    padding: .5rem;
  }
}
</style>
