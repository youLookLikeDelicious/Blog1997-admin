<template>
  <div></div>
</template>

<script>
export default {
  mounted () {
    // bind操作会跳转到该页面
    // 获取参数
    const params = window.location.search.match(/(code)=([^&]+)/i)
    if (!params || !params.length) {
      return
    }

    const query = [params[0]]

    if (this.type && ['wechat', 'github', 'qq'].includes(this.type)) {
      query.push('type=' + this.$route.params.type)
    }

    const action = this.$route.query.action || 'bind'

    this.$axios
      .post(`/user/${action}?${query.join('&')}`)
      .catch((error) => {
        const message = error.response.data.message
        if (message === '该账号已被绑定') {
          this.showDialog = true
          this.conflictInfo = error.response.data.data
          return {}
        }
      })
      .finally(() => {
        this.$router.push('/profile')
      })
  }
}
</script>

<style>

</style>
