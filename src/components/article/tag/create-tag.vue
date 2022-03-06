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
            <v-input v-model="model.name" placeholder="标签名称" style="width: 90%" clearable></v-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="父标签" prop="parent_id">
            <el-select v-model="model.parent_id" clearable size="small" style="width: 90%" placeholder="请选择父标签">
              <el-option v-for="tag in topTag" :key="tag.id" :value="tag.id" :label="tag.name" :disabled="tag.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="封面" prop="cover">
            <upload-image v-model="model.cover"></upload-image>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="描述" prop="description">
            <v-input v-model="model.description" textarea :autosize="{ minRows: 3 }" style="width: 90%" placeholder="标签描述"></v-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import { getTagInfo } from '~/api/article'
import DialogBox from '~/components/global/dialog-box'

const defaultModel = {
  id: '',
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
        name: { required: true, message: '请填写标签名称', trigger: 'change' },
        cover: { required: true, message: '请上传封面', trigger: 'change' }
      },
      model: { ...defaultModel },
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
      this.model.id = ''
      this.$refs.form.resetFields()
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
