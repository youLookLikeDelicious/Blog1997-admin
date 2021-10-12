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
      if (id && this.getOriginModel) {
        this.getOriginModel(id)
      }
      this.dialogVisible = true
      if (typeof this.loadData === 'function') {
        this.loadData()
      }
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
