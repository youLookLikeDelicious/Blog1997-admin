export default {
  methods: {
    autoHideCascader (vm) {
      if (vm.dropDownVisible) {
        vm.toggleDropDownVisible(false)
      }
    }
  }
}
