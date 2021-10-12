export default {
  props: {
    predefinedVisible: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      visible: this.predefinedVisible
    }
  },
  methods: {
    /**
     * 加载动画
     */
    enter ($el, done) {
      this.$animate($el, {
        opacity: 1,
        'margin-left': '0rem',
        'margin-top': '1rem',
        easing: 'bezier(0.6)',
        duration: 200
      }, () => {
        done()
      })
    },
    /**
     * 注销动画
     */
    leave ($el, done) {
      // $el.style.position = 'absolute'
      this.$animate(
        $el, {
          opacity: 0,
          'margin-left': '-3rem',
          'margin-top': '-2rem',
          easing: 'bezier(0.6)',
          duration: 200
        },
        done
      )
    },
    /**
     * 提交数据
     */
    submit () {
      if (this.allowSubmit) {
        this.$emit('toggleComponent')
        this.$emit('create', this.model, this.model.id)
      }
    },
    handleVisible () {
      this.visible = true
    },
    closeDialog () {
      this.visible = false
      this.$emit('close')
    }
  }
}
