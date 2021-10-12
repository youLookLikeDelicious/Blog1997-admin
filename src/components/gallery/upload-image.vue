<template>
  <v-dialog
    width="80rem"
    height="62rem"
    title="上传图片"
    :visible.sync="dialogVisible"
    @confirm="upload"
    @close="close"
  >
    <div class="upload-image-wrapper">
      <el-upload ref="upload" drag :before-upload="handleBeforeUpload" multiple :auto-upload="false" list-type="picture" action="" class="upload-box">
        <div>
          <i class="el-icon-upload"></i><br>
          <span class="el-upload__text">将文件拖到此处，或<em>点击上传</em></span>
        </div>
      </el-upload>
    </div>
  </v-dialog>
</template>

<script>
import DialogBox from '~/components/global/dialog-box'
export default {
  name: 'UploadImage',
  extends: DialogBox,
  data () {
    return {
    }
  },
  methods: {
    // 上传图片
    upload () {
      const uploadFiles = this.$refs.upload.uploadFiles
      // 没有文件需要上传
      if (!uploadFiles.length) {
        return
      }

      const formData = new FormData()
      uploadFiles.forEach((item) => {
        formData.append('upfile[]', item.raw)
      })
      // 开始提交
      this.$emit('create', formData)
    },
    handleBeforeUpload (file) {
      if (!/image\/\w+/.test(file.type)) {
        this.$setMessage({ msg: '未识别的图片格式', status: false })
        return false
      }
    },
    close () {
      this.$refs.upload.uploadFiles = []
    }
  }
}
</script>

<style lang="scss">
.upload-image-wrapper{
  display: flex;
  justify-content: center;
  padding: 0 1.2rem;
  .el-upload--picture{
    display: flex;
    flex-basis: 100%;
    justify-content: center;
    .el-upload-dragger{
      width: 98%;
    }
  }
  .upload-box {
    display: flex;
    flex-basis: 98%;
    flex-wrap: wrap;
    justify-content: center;
  }
  .el-upload-list{
    width: 98%;
  }
}
</style>
