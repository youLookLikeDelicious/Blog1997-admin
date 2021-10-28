<template>
  <v-dialog
    width="47rem"
    height="32rem"
    title="新增相册"
    @close="closeCallback"
    @confirm="handleSubmit"
    :visible.sync="dialogVisible">
    <el-form ref="form" :model="model" :rules="rules" label-position="right" label-width="14rem">
      <el-row class="album-create-wrapper">
        <el-col>
          <el-form-item label="相册名称" prop="name">
            <v-input v-model="model.name" placeholder="相册名称"></v-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="描述" prop="desc">
            <v-input v-model="model.desc" textarea placeholder="描述"></v-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import DialogBox from '~/components/global/dialog-box'
export default {
  extends: DialogBox,
  data () {
    return {
      model: {
        name: '',
        desc: ''
      },
      id: '',
      rules: {
        name: { required: true, message: '请填写相册名称', trigger: 'change' }
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.form.validate()
        .then(() => {
          this.$emit('create', this.model, this.id)
        })
    },
    closeCallback () {
      this.id = ''
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
</style>
