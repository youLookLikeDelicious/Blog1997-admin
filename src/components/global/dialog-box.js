export default {
  data () {
    return {
      id: '',
      loading: false,
      dialogVisible: false
    }
  },
  methods: {
    handleVisible (id) {
      this.id = id
      this.dialogVisible = true

      if (id && typeof this.getOriginModel === 'function') {
        this.getOriginModel(id)
      }
      if (typeof this.loadData === 'function') {
        this.loadData()
      }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    /**
     * 创建表单
     */
    submit () {
      this.$refs.form.validate().then(() => {
        const formData = this.$json2FormData(this.model)
        this.$emit('create', formData, this.model.id || '')
      })
    },
    closeCallback () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    }
  }
}
