<template>
  <v-dialog
    title="导入敏感词汇"
    width="65rem"
    height="43rem"
    :visible.sync="dialogVisible"
    @confirm="submit"
    @close="closeCallback">
    <el-form ref="form" :model="model" :rules="rules" label-width="6rem" label-position="left">
      <el-row type="flex" class="import-sensitive-word" justify="center">
        <el-col>
          <el-form-item label="分类" prop="category_id">
            <v-select :options="categoryList" v-model="model.category_id" palceholder="屏蔽方式"></v-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label-width="文件" prop="file">
            <el-upload ref="upload"
              action="/"
              :auto-upload="false"
              accept=".txt"
              :limit="1"
              :multiple="false"
              drag
              :on-change="handleBeforeUpload"
              :on-remove="() => model.file = ''"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传txt文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import { importWord } from '~/api/sensitive-word'
import DialogBox from '~/components/global/dialog-box'

export default {
  name: 'ImportDialog',
  extends: DialogBox,
  props: {
    categoryList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      model: {
        file: '',
        category_id: 0
      },
      rules: {
        category_id: { required: true, message: '请选择分类', trigger: 'change' },
        file: { required: true, message: '请上传文件', trigger: 'change' }
      }
    }
  },
  methods: {
    /**
     * 提交表单
     */
    submit () {
      // 将模型转为formData
      this.$refs.form.validate().then(() => {
        const formData = new FormData()
        formData.append('category_id', this.model.category_id)
        formData.append('file', this.model.file)

        importWord(formData).then(() => {
          // 隐藏对话框
          this.closeDialog()
          this.$emit('imported')
        })
      })
    },
    /**
     * 关闭对话框回调
     */
    closeCallback () {
      this.model = { category_id: 0, file: '' }
    },
    handleBeforeUpload (file) {
      console.log(/text\/\w+/.test(file.raw.type))
      if (!/text\/\w+/.test(file.raw.type)) {
        this.$setMessage({ msg: '不支持的文件格式', status: false })
        this.$refs.upload.uploadFiles = []
      }
      this.model.file = file.raw
    }
  }
}
</script>

<style lang="scss">
.import-sensitive-word{
  flex-wrap: wrap;
  .el-col {
    flex: 1 1 100%;
    .el-form-item{
      display: flex;
      justify-content: center;
    }
    .el-form-item__content{
      margin-left: 1.2rem !important;
    }
  }
  .el-upload__tip{
    text-align: center;
  }
}
</style>
