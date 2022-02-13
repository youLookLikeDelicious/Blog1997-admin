<template>
  <div>
    <transition name="next">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseLayout'
}
</script>

<style lang="scss">
</style>
