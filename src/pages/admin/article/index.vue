<template>
  <div class="">
    <transition name="next">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ArticleWrapper'
}
</script>

<style lang="scss">
</style>
