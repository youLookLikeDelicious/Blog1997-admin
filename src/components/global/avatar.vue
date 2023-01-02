<template>
  <div class="user-info">
    <el-image class="avatar" fit="cover" :src="user.avatar" :alt="alt">
      <img
        slot="error"
        class="avatar"
        src="/admin/image/avatar.svg"
      />
    </el-image>
    <span v-if="user.name">{{ user.name }}</span>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    user: {
      type: Object,
      default () {
        return {
          avatar: '',
          name: ''
        }
      }
    },
    alt: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  padding-right: 2rem;
}
.avatar {
  $size: 3.5rem;
  width: $size;
  height: $size;
  line-height: $size;
  border-radius: $size;
  text-align: center;
  margin-right: 0.7rem;
  i {
    font-size: 3rem;
  }
}
</style>
