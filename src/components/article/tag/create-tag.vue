<template>
  <v-dialog
    width="64rem"
    height="47rem"
    :title="model.id ? '编辑标签' : '创建标签'"
    :visible.sync="dialogVisible"
    @confirm="submit"
    @close="closeCallback"
  >
    <el-form ref="form" :model="model" :rules="rules" label-width="12rem" style="padding-right: 2.1rem" label-position="right">
      <el-row>
        <el-col>
          <el-form-item label="名称" prop="name">
            <el-input v-model="model.name" placeholder="标签名称" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="父标签" prop="parent_id">
            <el-select v-model="model.parent_id" clearable size="small" style="width: 100%" placeholder="请选择父标签">
              <el-option v-for="tag in topTag" :key="tag.id" :value="tag.id" :label="tag.name" :disabled="tag.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="封面" prop="cover">
            <el-upload
              action="#"
              :show-file-list="false"
              list-type="picture-card"
              accept=".jpg,.png,.gif,.webp"
              :class="{ 'has-cover': imageUrl }"
              :before-upload="handleBeforeUpload">
              <div v-if="imageUrl" class="cover relative-position">
                <el-image :src="imageUrl" fit="contain" alt="" />
                <span class="el-icon-delete" @click.stop.prevent="handleRemoveCover"></span>
              </div>
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="描述" prop="description">
            <el-input v-model="model.description" type="textarea" :autosize="{ minRows: 3 }" placeholder="标签描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import { getTagInfo } from '~/api/article'
import DialogBox from '~/components/global/dialog-box'

const defautlModel = {
  name: '',
  cover: '',
  parent_id: '',
  description: ''
}

export default {
  name: 'CreateTag',
  extends: DialogBox,
  data () {
    return {
      rules: {
        name: { required: true, message: '请填写标签名称', trigger: 'blur' },
        cover: { required: true, message: '请上传封面', trigger: 'change' }
      },
      model: { ...defautlModel },
      coverUrl: '',
      topTag: [], // 顶级标签,
      imageUrl: ''
    }
  },
  methods: {
    // 获取表单详情
    getOriginModel (id) {
      getTagInfo(id).then(res => {
        this.model = { ...res.data.data, parent_id: res.data.data.parent_id || undefined }
        this.imageUrl = res.data.data.cover
      })
    },
    /**
     * 获取顶级标签
     */
    loadData () {
      this.$axios.get('/admin/tag/create').then((response) => {
        const topTag = response.data.data
        let currentTag
        if (this.id && (currentTag = topTag.find(tag => tag.id === this.id))) {
          currentTag.disabled = true
        }
        this.topTag = topTag
      })
    },
    // 关闭对话框
    closeCallback () {
      this.imageUrl = ''
      this.$refs.form.resetFields()
    },
    // 验证图片格式
    handleBeforeUpload (file) {
      if (!/image\/\w+/.test(file.type)) {
        this.$setMessage({ msg: '未识别的图片格式', status: false })
      } else {
        this.model.cover = file
        this.imageUrl = URL.createObjectURL(file)
      }
      return false
    },
    // 移除图片
    handleRemoveCover () {
      this.imageUrl = ''
      this.model.cover = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
  /deep/.el-image {
    width: 12rem;
    height: 12rem;
    vertical-align: middle;
  }
  span {
    top: 50%;
    left: 50%;
    z-index: 9999;
    font-size: 1.8rem;
    display: block;
    color: #f5f7fa;
    position: absolute;
    transform: translate(-50%, -50%);
    display: none;
  }
}
.has-cover {
  .cover {
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: transparent;
      transition: background-color .3s;
    }
    &:hover{
      &::after {
        background-color: rgba(#000, .3);
      }
      span {
        display: block;
      }
    }
  }
}
</style>
