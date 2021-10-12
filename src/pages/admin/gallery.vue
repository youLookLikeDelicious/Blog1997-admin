<template>
<div>
  <base-component ref="base" requestApi="/admin/gallery" @updated-data="updatedData">
    <template v-slot:search="{ query, getList }">
      <el-col :span="1">
        <el-color-picker
          size="small"
          v-model="query.color"
          :predefine="predefineColors"
          @change="getList"
          color-format="rgb"
        ></el-color-picker>
      </el-col>
      <el-col :span="4">
        <v-input v-model="query.keywords" placeholder="地点/描述" theme="box"></v-input>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="query.date"
          type="daterange"
          align="right"
          size="small"
          unlink-panels
          range-separator="至"
          start-placeholder="拍摄时间"
          end-placeholder="拍摄时间"
          value-format="yyyy-MM-dd"
          @change="getList"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
    </template>
    <template v-slot:rightButton>
      <el-col :span="3" class="right-btn">
        <v-button type="primary" icon="icofont-upload-alt" @click="handleShowCreate">上传图片</v-button>
      </el-col>
    </template>
    <template v-slot:default="{ deleteRecord, data }">
      <ul class="gallery-image-list">
        <li
          v-for="(item, index) in data"
          :key="index"
          class="relative-position"
        >
          <div class="relative-position"
            style="overflow: hidden; width: 100%"
            @mouseenter="showToolBar"
            @mouseleave="hiddenToolBar">
            <el-image :src="item.url + '?t=min'" @click="showPreImage(index)">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <div class="tool-bar">
              <a
                href="/"
                @click.prevent
                @click="deleteRecord(index)"
                class="icofont-ui-delete"
              ></a>
            </div>
          </div>
          <div class="image-info">{{ item.date_time }}</div>
        </li>
      </ul>
    </template>
  </base-component>
  <!-- 预览大图 -->
  <upload-image
    ref="create"
    @create="handleCreate"
  />
</div>
</template>

<script>
import Vue from 'vue'
import { dateRangePickerMixin } from '~/mixin'
import uploadImage from '~/components/gallery/upload-image'
import BigImage from '~/components/gallery/big-image.vue'

const BigImageConstruct = Vue.extend(BigImage)
export default {
  name: 'Gallery',
  mixins: [dateRangePickerMixin],
  components: {
    uploadImage
  },
  data () {
    return {
      bigImageComponent: '',
      imageList: [],
      useUploadBox: false,
      pageInfo: undefined,
      currentImageIndex: 0,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ]
    }
  },
  methods: {
    /**
     * 显示大图
     */
    showPreImage () {
      if (!this.bigImageComponent) {
        this.bigImageComponent = new BigImageConstruct({
          propsData: {
            currentIndex: this.currentImageIndex,
            imageList: this.imageList
          },
          el: document.createElement('div')
        })
        document.body.appendChild(this.bigImageComponent.$el)
      }
      this.bigImageComponent.handleVisible()
    },
    handleShowCreate () {
      this.$refs.create.handleVisible()
    },
    /**
     * 获取相册列表列表
     */
    updatedData (data) {
      this.imageList = data
    },
    /**
     * 显示工具栏
     */
    showToolBar (event) {
      this.$animate(event.target.querySelector('div.tool-bar'), {
        left: '0%',
        opacity: 1,
        duration: 256
      })
    },
    /**
     * 隐藏工具栏
     */
    hiddenToolBar (event) {
      this.$animate(event.target.querySelector('div.tool-bar'), {
        left: '100%',
        opacity: 0,
        duration: 256
      })
    },
    handleCreate () {
      this.$refs.base.create(...arguments)
    }
  },
  beforeDestroy () {
    if (this.bigImageComponent) {
      this.bigImageComponent.$destroy()
    }
  }
}
</script>

<style lang="scss">
.gallery-upload-btn {
  width: 9rem;
  color: #5c9dff !important;
  position: relative;
  text-align: center;
  padding: 0.5rem 0rem;
  border-radius: 0.3rem;
  display: inline-block;
  border: 0.1rem solid #5c9dff;
  input {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
  }
}
.gallery-image-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &::after {
    content: '';
    flex: auto;
  }
  li {
    width: 20%;
    overflow: hidden;
    margin: 1rem 0;
    box-sizing: border-box;
    padding: 0 1.2rem;
  }
  .el-image{
    width: 100%;
  }
  img {
    width: 100%;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  .tool-bar {
    left: 100%;
    width: 100%;
    bottom: .7rem;
    color: #fff;
    text-align: right;
    position: absolute;
    padding-right: 2rem;
    box-sizing: border-box;
    background-color: rgba(6, 6, 6, 0.7);
  }
  .image-slot{
    color: #999;
  }
  .image-info{
    bottom: 2rem;
    left: 1.7rem;
    color: #f5f7fa;
    position: absolute;
  }
}
</style>
