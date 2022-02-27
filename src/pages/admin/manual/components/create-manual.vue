/** @component 创建手册 */
<template>
  <v-dialog
    width="64rem"
    height="45rem"
    @confirm="submit"
    @close="closeCallback"
    :visible.sync="dialogVisible"
    :title="id ? '编辑手册' : '创建手册'">
    <el-form ref="form" :model="model" :rules="rules" label-position="right" label-width="12rem" style="padding-right: 2.1rem">
      <el-form-item label="名称" prop="name">
        <v-input placeholder="名称" style="width: 98%" v-model="model.name"></v-input>
      </el-form-item>
      <el-form-item label="简介" prop="summary">
        <v-input textarea style="width: 98%" placeholder="简介" v-model="model.summary"></v-input>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <upload-image v-model="model.cover" />
      </el-form-item>
      <el-form-item label="公开" prop="is_public">
        <v-switch v-model="model.is_public" :left-value="1" style="margin-top: .5rem" :right-value="2" />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import DialogBox from '~/components/global/dialog-box'
import { getManualInfo } from '~/api/manual'

export default {
  extends: DialogBox,
  data () {
    return {
      model: {
        name: '',
        cover: '',
        summary: '',
        is_public: 1
      },
      rules: {
        name: { required: true, message: '请填写手册名称', trigger: 'change' },
        cover: { required: true, message: '请上传封面', trigger: 'change' }
      }
    }
  },
  methods: {
    getOriginModel () {
      getManualInfo(this.id).then(response => {
        this.model = response.data.data
      })
    },
    closeCallback () {
      this.model.cover = ''
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style>

</style>
