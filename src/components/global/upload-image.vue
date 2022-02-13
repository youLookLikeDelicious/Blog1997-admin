/** @component 上传图片组件 */
<template>
  <el-upload
    :action="action"
    :show-file-list="false"
    list-type="picture-card"
    accept=".jpg,.png,.gif,.webp"
    :class="{ 'has-cover': imageUrl }"
    :before-upload="handleBeforeUpload">
    <div v-if="imageUrl" class="cover relative-position">
      <el-image ref="image" :src="imageUrl" fit="cover" alt="" :preview-src-list="[imageUrl]" />
      <span class="icon-wrap">
        <i class="el-icon-zoom-in" @click.stop.prevent="handlePreview"></i>
        <i class="el-icon-delete" @click.stop.prevent="handleRemoveCover"></i>
      </span>
    </div>
    <i class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  props: {
    action: {
      default () {
        return '#'
      }
    },
    value: {
      default () {
        ''
      }
    }
  },
  data () {
    return {
      file: ''
    }
  },
  computed: {
    imageUrl () {
      return typeof this.file === 'string' || !this.file ? this.file : URL.createObjectURL(this.file)
    }
  },
  watch: {
    value: {
      handler () {
        if (this.value !== this.file) {
          this.file = this.value
        }
      },
      immediate: true
    },
    imageUrl () {
      if (this.value === this.file) return
      this.$emit('input', this.file)
    }
  },
  methods: {
    // 验证图片格式
    handleBeforeUpload (file) {
      if (!/image\/\w+/.test(file.type)) {
        this.$setMessage({ msg: '未识别的图片格式', status: false })
      } else if (this.action === '#') {
        this.file = file
      }
      return false
    },
    // 移除图片
    handleRemoveCover () {
      this.file = ''
    },
    // 预览图片
    handlePreview () {
      this.$refs.image.clickHandler()
    }
  }
}
</script>

<style lang="scss">
.has-cover {
  box-sizing: border-box;
  overflow: hidden;
  .el-image {
    height: 100%
  }
  .cover {
    height: 98%;
    overflow: hidden;
    position: relative;
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
      .el-icon-delete, .el-icon-zoom-in {
        opacity: 1;
      }
      &::after {
        background-color: rgba(#000, .3);
      }
      span {
        display: block;
      }
    }
    .icon-wrap {
      top: 50%;
      left: 50%;
      z-index: 999;
      position: absolute;
      transform: translate(-50%, -50%);
    }
    .el-icon-delete, .el-icon-zoom-in{
      font-size: 2.1rem;
      color: #fff;
      opacity: 0;
    }
    .el-icon-zoom-in {
      margin-right: 1.2rem;
    }
  }
}
</style>
