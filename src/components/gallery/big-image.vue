<template>
  <transition name="big-image-wrapper">
    <div v-show="visible" class="big-image">
      <div class="preview-tools">
        <span class="el-icon-zoom-out" @click="handleZoomOut"></span>
        <span class="el-icon-zoom-in" @click="handleZoomIn"></span>
        <span class="el-icon-refresh-left" @click="handleRotate('left')"></span>
        <span class="el-icon-refresh-right" @click="handleRotate('right')"></span>
        <span class="el-icon-warning-outline" @click="handleShowExif"></span>
        <v-button text @click="handleClose" icon="el-icon-circle-close"></v-button>
      </div>
      <div class="content-wrapper">
        <v-button v-show="showArrow" text @click="previous"><i class="icofont-rounded-double-left left-arrow"></i></v-button>
        <div v-if="loading" class="el-image__placeholder" key="loading">
          <span class="el-icon-loading"></span>
        </div>
        <div v-if="error" key="error">
          <div class="el-image__error">图片载入失败</div>
        </div>
        <transition name="image-content">
          <img v-if="showArrow"
            key="img"
            draggable="true"
            @mousedown="handleMouseDown"
            :src="imageUrl"
            :style="{
              transform: `scale(${styleProps.zoom}) rotate(${styleProps.rorate}deg) translate(${styleProps.offsetX}px, ${styleProps.offsetY}px)` }"
            alt="">
        </transition>
        <v-button v-show="showArrow" text @click="next"><i class="icofont-rounded-double-left right-arrow"></i></v-button>
      </div>
      <!-- 图片详情部分 -->
      <div v-if="showExif" class="image-exif">
        <el-row>
          <el-col :span="24">
            <span>经纬度: {{ infoData.lng_lat || '-' }}</span>
          </el-col>
          <el-col :span="24">
            <span>拍摄位置: {{ infoData.location || '-' }}</span>
          </el-col>
          <el-col :span="24">
            <span>拍摄时间: {{ infoData.date_time || '-' }}</span>
          </el-col>
          <el-col :span="24">
            <span>设备名称: {{ infoData.camera_name || '-' }}</span>
          </el-col>
          <el-col :span="24">
            <span>曝光时间: {{ infoData.exposure_time || '-' }}</span>
          </el-col>
          <el-col :span="24">
            <span>焦距: {{ infoData.focal_length || '-' }}</span>
          </el-col>
          <el-col :span="24">
            <span>描述: {{ infoData.remark || '-' }}</span>
            <span><v-button text icon="el-icon-edit"></v-button></span>
          </el-col>
          <el-col :span="24">
            <span>光圈数量: {{ infoData.f_number || '-' }}</span>
          </el-col>
          <el-col :span="24">
            <span>颜色: </span>
            <div class="color-box">
              <div v-for="(color, index) in infoData.colors.split(';')" :key="index">
                <span :style="{ background: `rgb(${color})` }"></span>
                #{{color.split(',').map(item => (+item).toString(16).padStart(2, '0')).join('')}}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </transition>
</template>

<script>
import { getGalleryInfo } from '~/api/upload'
import { rafThrottle } from 'element-ui/src/utils/util'
export default {
  name: 'BigImage',
  data () {
    return {
      styleProps: {
        zoom: 1,
        rorate: 0,
        offsetX: 0,
        offsetY: 0
      },
      error: false,
      visible: false,
      loading: false,
      index: this.currentIndex || 0,
      imageUrl: '',
      infoData: '',
      showExif: false
    }
  },
  props: {
    imageList: {
      type: Array,
      default () {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  watch: {
    currentIndex: {
      handler (val) {
        this.index = val
        this.loadImage()
      },
      immediate: true
    },
    index () {
      this.loadImage()
    }
  },
  computed: {
    // 是否显示箭头
    showArrow () {
      return !this.loading && !this.error
    }
  },
  methods: {
    handleVisible () {
      this.visible = true
      this.loadImage()
    },
    // 关闭对话框
    handleClose () {
      this.visible = false
    },
    /**
     * 获取下一张图片
     *
     * @return {void}
     */
    next () {
      if (this.index >= this.imageList.length - 1) {
        return
      }
      ++this.index
    },
    /**
     * 获取前一张图片
     *
     * @return {void}
     */
    previous () {
      if (this.index === 0) {
        return
      }
      --this.index
    },
    // 载入图片
    loadImage () {
      if (this.loading) return
      const img = new Image()
      this.loading = true
      this.error = false
      img.onload = e => {
        this.handleLoadImage(e, img)
        this.imageUrl = img.src
      }
      img.onerror = this.handleError.bind(this)
      Object.keys(this.$attrs)
        .forEach((key) => {
          const value = this.$attrs[key]
          img.setAttribute(key, value)
        })
      img.src = this.imageList[this.index].url
      this.loadGalleryInfo()
    },
    loadGalleryInfo () {
      if (!this.imageList[this.index].id) return
      getGalleryInfo(this.imageList[this.index].id)
        .then(res => {
          this.infoData = res.data.data
        })
    },
    // 图片载入成功回调
    handleLoadImage (e, img) {
      this.loading = false
      this.error = false
    },
    // 图片处理失败回调
    handleError (e) {
      this.loading = false
      this.error = true
    },
    // 缩小
    handleZoomOut () {
      if (this.styleProps.zoom <= 0.2) {
        return
      }
      this.styleProps.zoom -= 0.2
    },
    // 放大
    handleZoomIn () {
      this.styleProps.zoom += 0.2
    },
    // 旋转
    handleRotate (direction) {
      if (direction === 'left') {
        this.styleProps.rorate -= 90
      } else {
        this.styleProps.rorate += 90
      }
    },
    // 鼠标点击事件
    handleMouseDown (e) {
      const startX = e.pageX; const startY = e.pageY
      const originX = this.styleProps.offsetX
      const originY = this.styleProps.offsetY
      const mouseMoveHandler = rafThrottle(event => {
        this.styleProps.offsetX = originX + event.pageX - startX
        this.styleProps.offsetY = originY + event.pageY - startY
      })

      const mouseUpHandler = () => {
        this.styleProps.offsetX = 0
        this.styleProps.offsetY = 0
        document.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
      }

      document.addEventListener('mouseup', mouseUpHandler)

      document.addEventListener('mousemove', mouseMoveHandler)
      e.preventDefault()
    },
    // 显示图片的exif信息
    handleShowExif () {
      this.showExif = !this.showExif
    }
  }
}
</script>

<style lang="scss">
.big-image {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  background-color: rgba(5, 5, 5, .7);
  img{
    display: block;
    max-width: 100%;
    max-height: 100%;
    transition: all .3s;
    object-fit: contain;
    margin: 0 auto;
  }
  .el-image__error, .el-image__placeholder{
    top: 50%;
    left: 50%;
    display: flex;
    min-width: 7.5rem;
    position: absolute;
    text-align: center;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    background: transparent !important;
    .el-icon-loading{
      color: #f5f7fa;
      font-size: 4rem;
    }
  }
  .icofont-rounded-double-left{
    color: #fff;
    font-size: 6rem;
    position: absolute;
    top: 50%;
  }
  .left-arrow{
    z-index: 2;
    left: 2.4rem;
    &:hover{
      &::after{
        content: "\EA97";
        font-size: 6rem;
        color: #fff;
        position: absolute;
        right: 0rem;
        animation: arrow-fade .8s infinite;
      }
    }
  }
  .right-arrow{
    z-index: 2;
    right: 2.4rem;
    transform: rotateZ(180deg);
    &:hover{
      &::after{
        content: "\EA97";
        font-size: 6rem;
        color: #fff;
        position: absolute;
        right: 0rem;
        animation: arrow-fade .8s infinite;
      }
    }
  }
  @keyframes arrow-fade {
    to{
      right: 3rem;
      opacity: 0;
    }
  }
  .content-wrapper {
    display: flex;
    margin: 0 auto;
    height: 100%;
    width: fit-content;
    white-space: nowrap;
    align-items: center;
    justify-content: space-between;
    .v-button{
      width: 6rem;
      &:first-child {
        margin-left: 0;
        margin-right: 1.2rem;
      }
      display: inline-block;
    }
  }
  .preview-tools{
    top: 0;
    left: 0;
      height: 4rem;
      line-height: 4rem;
    right: 7vw;
    z-index: 3;
    width: 100%;
    position: fixed;
    text-align: right;
    background: rgba(5, 5, 5, .5);
    span, .el-icon-circle-close {
      cursor: pointer;
      color: #f5f7fa;
      margin: 0 1.2rem;
      font-size: 1.8rem;
    }
  }
  .transition-content{
    width: 100%;
    height: 100%;
  }
}
.big-image-wrapper-enter-active {
  transition: transform .3s, opacity .3s;
}
.big-image-wrapper-enter {
  opacity: 0;
  transform: scale3d(.3, .7, 1);
}
.big-image-wrapper-leave-active{
  transition: transform .4s, opacity .4s;
  img {
    opacity: 0 !important;
  }
}
.big-image-wrapper-leave-to {
  opacity: 0;
  transform: scale3d(.3, .2, 1);
}
// 图片过度效果
.image-content-enter-active, .image-content-leave-active {
  transition: transform .3s opacity .3s !important;
}
.image-content-enter, .image-content-leave-to{
  opacity: 0;
  transform: scale3d(.2, .2, 1) !important;
}
// exif信息样式
.image-exif {
  right: 0;
  top: 4rem;
  z-index: 9;
  width: 45rem;
  height: 100%;
  position: fixed;
  color: #f5f7fa;
  padding: 1.2rem 2.4rem;
  box-sizing: border-box;
  background: rgba(5, 5, 5, .7);
  .el-col{
    margin: .3rem 0;
  }
  .el-row{
    height: calc(100% - 4rem);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    @extend %scroll-bar-min;
  }
  .color-box{
    display: flex;
    flex-wrap: wrap;
    div {
      flex: 1 1 50%;
    }
    span{
      width: 1.7rem;
      height: 1.7rem;
      margin-right: .7rem;
      display: inline-block;
    }
  }
}
</style>
