/** @page 相册 */
<template>
  <div>
    <el-page-header v-if="'AlbumGallery' === routeName" @back="goBack" class="album-header" content="详情页面">
    </el-page-header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    goBack () {
      this.$router.push('/gallery/album')
    }
  }
}
</script>

<style lang="scss">
.album-header{
  padding-top: 1.2rem;
  padding-left: 1.8rem;
  margin-bottom: -.1rem;
  background-color: #fff;
}
</style>
