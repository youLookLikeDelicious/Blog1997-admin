<template>
  <v-dialog
    width="80rem"
    height="62rem"
    title="上传图片"
    :visible.sync="dialogVisible"
    @confirm="upload"
    @close="close"
  >
    <div class="upload-image-wrapper" label-position="right" label-width="4rem">
      <el-form ref="form" :model="model">
        <el-row style="padding-left: 2.7rem">
          <el-form-item prop="album" label="" :rules="{ required: true, message: '请填写相册', trigger: 'change' }">
            <v-select v-model="model.album" :options="albumList" allowCreate placeholder="相册" :props="{ value: 'name' }"></v-select>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row class="upload-wrapper mt-min">
        <el-upload ref="upload" drag :before-upload="handleBeforeUpload" multiple :auto-upload="false" list-type="picture" action="" class="upload-box">
          <div>
            <i class="el-icon-upload"></i><br>
            <span class="el-upload__text">将文件拖到此处，或<em>点击上传</em></span>
          </div>
        </el-upload>
      </el-row>
    </div>
  </v-dialog>
</template>

<script>
import { getAlbumAll } from '~/api/upload'
import DialogBox from '~/components/global/dialog-box'
export default {
  name: 'UploadImage',
  extends: DialogBox,
  data () {
    return {
      albumList: [],
      model: {
        album: ''
      }
    }
  },
  methods: {
    // 上传图片
    upload () {
      this.$refs.form.validate().then(() => {
        const uploadFiles = this.$refs.upload.uploadFiles
        // 没有文件需要上传
        if (!uploadFiles.length) {
          return
        }

        const formData = new FormData()
        formData.append('album', this.model.album)
        uploadFiles.forEach((item) => {
          formData.append('upfile[]', item.raw)
        })
        // 开始提交
        this.$emit('create', formData)
      })
    },
    handleBeforeUpload (file) {
      if (!/image\/\w+/.test(file.type)) {
        this.$setMessage({ msg: '未识别的图片格式', status: false })
        return false
      }
    },
    // 获取相册列表
    loadData () {
      getAlbumAll().then(res => {
        this.albumList = res.data.data
      })
    },
    close () {
      this.$refs.upload.uploadFiles = []
      this.model.album = ''
    }
  }
}
</script>

<style lang="scss">
.upload-image-wrapper{
  .upload-wrapper{
    display: flex;
    justify-content: center;
    padding: 0 1.2rem;
  }
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
