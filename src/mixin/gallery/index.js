export const GalleryMixin = {
  methods: {
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
    }
  }
}
