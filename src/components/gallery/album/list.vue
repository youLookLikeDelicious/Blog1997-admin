/** @page 相册 */
<template>
  <div>
    <base-component ref="base" requestApi="/admin/gallery/album" @updated-data="updatedData">
      <template v-slot:search="{ query, getList }">
        <el-col :span="4">
          <v-input v-model="query.name" placeholder="相册名称" @change="getList" theme="box"></v-input>
        </el-col>
      </template>
      <template v-slot:rightButton="{ handleShowCreate }">
        <el-col :span="2" class="right-btn text-align-right">
          <v-button type="primary" icon="el-icon-upload" @click="handleShowUpload">上传图片</v-button>
        </el-col>
        <el-col :span="2" class="text-align-right">
          <v-button type="primary" icon="icofont-upload-alt" @click="handleShowCreate">新建相册</v-button>
        </el-col>
      </template>
      <template v-slot:create="{ create }">
        <album-create ref="create" @create="create"></album-create>
      </template>
      <!-- 列表部分 -->
      <template v-slot="{ data, deleteRecord }">
        <ul class="album-list gallery-image-list">
          <li
            v-for="(item, index) in data"
            :key="index"
            class="relative-position"
          >
            <div class="relative-position album-box"
              style="overflow: hidden; width: 100%"
              @mouseenter="showToolBar"
              @mouseleave="hiddenToolBar">
              <el-image v-if="item.gallery" :src="item.gallery.url + '?t=min'" fit="cover" @click="goToGallery(item.id)">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
              <div v-else class="cover-placeholder" @click="goToGallery(item.id)">
                <i class="iconfont icon-chakanxiangce"></i>
              </div>
              <div>
                <div class="album-name">{{ item.name }}</div>
                <div class="album-desc" :title="item.desc">{{ item.desc }}</div>
              </div>
              <div class="tool-bar">
                <v-button text icon="icofont-ui-delete" @click="deleteRecord(item.id)"></v-button>
                <v-button text icon="icofont-ui-edit" @click="handleUpdateAlbum({ name: item.name, desc: item.desc}, item.id)"></v-button>
              </div>
            </div>
            <div class="image-info">{{ item.date_time }}</div>
          </li>
        </ul>
      </template>
    </base-component>
    <upload-image
      ref="upload"
      @create="handleCreate"
    />
  </div>
</template>

<script>
import { GalleryMixin } from '~/mixin/gallery'
import AlbumCreate from '~/components/gallery/album/create'
import uploadImage from '~/components/gallery/upload-image'
export default {
  name: 'Album',
  mixins: [GalleryMixin],
  components: { uploadImage, AlbumCreate },
  data () {
    return {
      albumList: []
    }
  },
  methods: {
    updatedData (data) {
      this.albumList = data.data
    },
    handleShowUpload () {
      this.$refs.upload.handleVisible()
    },
    handleCreate () {
      this.$refs.base.create(arguments[0], '', '/admin/gallery')
        .then(_ => {
          this.$refs.upload.closeDialog()
        })
    },
    handleUpdateAlbum (album, id) {
      this.$refs.create.model = album
      this.$refs.create.handleVisible(id)
    },
    // 跳转到图片列表
    goToGallery (id) {
      this.$router.push({ name: 'AlbumGallery', params: { id } })
    }
  }
}
</script>

<style lang="scss">
.album-list{
  .album-box {
    border-radius: .5rem;
    height: 17rem;
    border: .1rem solid #DCDFE6;
    img{
      height: 17rem;
    }
    .album-name, .album-desc{
      z-index: 9;
      color: #f5f7fa;
      position: absolute;
    }
    .album-name {
      top: 4rem;
      left: 3rem;
      font-weight: bold;
      font-size: 1.7rem;
    }
    .album-desc{
      width: 80%;
      left: 3rem;
      max-height: 6rem;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      bottom: 1rem;
    }
  }
  .cover-placeholder{
    cursor: pointer;
    color: rgba(#f5f7fa, .82);
    text-align: center;
    line-height: 17rem;
    background-color: rgba($blue, .3);
    .icon-chakanxiangce{
      font-size: 12rem;
    }
  }
}
</style>
