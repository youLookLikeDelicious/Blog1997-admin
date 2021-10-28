<template>
  <div
    :class="{ 'ui-select': true, 'ui-select-on': focused }"
    :style="{ 'z-index': zIndex, width }"
    @click="focusSelect"
  >
    <div class="flex input-wrapper" @mouseenter="mouseIsEnter = true" @mouseleave="mouseIsEnter = false">
      <!-- <span> 被选中的内容 -->
      <span v-if="multiple">
        <span v-for="(option, index) in selectedOptions" :key="index" class="tag"
          >{{ generateTag(option) }} <i @click="cancelSelect(index)">x</i></span
        >
      </span>
      <!-- </span> -->
      <input
        v-if="showSearchInput"
        ref="input"
        v-model="inputValue"
        :placeholder="currentPlaceHolder"
        autocomplete="off"
        type="text"
      />
      <!-- 在input placeholder中显示单选的内容 -->
      <input
        v-else-if="!multiple"
        type="text"
        :placeholder="placeholder"
        ref="input"
        @focus="focusSelect"
        :value="selectedOptions.length ? generateTag(selectedOptions[0]) : ''"
        autocomplete="off"
      />
      <span v-if="clearable && mouseIsEnter" class="el-icon-circle-close" @click.stop="handleClear"></span>
    </div>
    <div class="relative-position max-width">
      <div ref="ul-wrapper" class="inline-block options-wrapper">
        <div class="arrow-top"></div>
        <ul data-display="flex" @click.stop>
          <li
            v-for="(item, index) in filterItem"
            :key="index"
            :class="{
              'no-pointer': item.id === false,
              on: checkItemIsSelected(item) !== false,
              disabled: item.disabled
            }"
            @click="toggleItem(index)"
            v-html="item.name || item"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-select',
  props: {
    // 选项列表
    options: {
      type: Array,
      default () {
        return []
      }
    },
    // placeholder
    placeholder: {
      type: String,
      default () {
        return ''
      }
    },
    // 是否允许创建新的结果
    allowCreate: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 是否允许多选
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 多选内容的最大数量
    maxOptions: {
      type: Number,
      default () {
        return 10
      }
    },
    // 元素的宽度
    width: {
      type: String,
      default () {
        return '27rem'
      }
    },
    allowSearch: {
      type: Boolean,
      default () {
        return true
      }
    },
    clearable: {
      type: Boolean,
      default () {
        return false
      }
    },
    props: {
      type: Object,
      default () {
        return {
          label: 'name',
          value: 'id'
        }
      }
    }
  },
  data () {
    return {
      selectedOptions: [], // 被选中的元素[{id: , name: }]
      focused: false,
      inputValue: '',
      createdOptions: '',
      zIndex: 2,
      createList: [],
      mouseIsEnter: false
    }
  },
  computed: {
    /**
     * 根据input的内容，过滤显示的下拉列表
     *
     * @return {array}
     */
    filterItem () {
      if (!this.inputValue && !this.createList.length) {
        return this.options.length
          ? this.options
          : [{ name: '暂无记录', [this.props.value]: false }]
      }

      // 正则匹配选项
      let result = []
      if (this.inputValue) {
        const preg = new RegExp(`.*${this.inputValue}.*`, 'i')
        result = this.options.filter((item) => preg.test(item.name || item))
      } else {
        result = [...this.options]
      }

      // 如果允许创建新的值，向结果中追加新的值
      if (this.allowCreate) {
        result.push(...this.createList)
        if (this.inputValue) {
          result.push({ name: this.inputValue, [this.props.value]: -1 })
        }
      }

      if (!result.length) {
        result.push({ name: '暂无记录', [this.props.value]: false })
      }

      return result
    },
    /**
     * 判断是否显示搜索框
     *
     * @return {boolean}
     */
    showSearchInput () {
      return (this.allowSearch && this.focused) || this.multiple
    },
    /**
     * 计算Placeholder属性
     *
     * @return {string}
     */
    currentPlaceHolder () {
      // 单选的情况
      if (!this.multiple) {
        return this.$attrs.value === ''
          ? this.placeholder
          : this.generateTag(this.selectedOptions[0])
      }
      return this.$attrs.value.length ? '' : this.placeholder
    }
  },
  watch: {
    /**
     * listen $attrs attribute
     * 通过父组件 绑定的值，来设置当前组件 selectedOptions
     */
    '$attrs.value': {
      handler (val) {
        if (!val && this.allowCreate && this.createList.length) {
          this.createList = []
        }
        if (this.allowCreate) {
          this.appendCreateList()
        }

        let selectedOptions = this.getSelectedOptions()

        if (!selectedOptions.length && this.$attrs.value) {
          this.appendCreateList(this.$attrs.value)
        }

        // 如果当前值没有再选项列表中，再createList追加之
        // 防止 v-if / v-show 之后，createList数据内容失效
        if (
          !selectedOptions.length &&
          this.allowCreate &&
          this.$attrs.value &&
          this.$attrs.value.length
        ) {
          this.appendCreateList(this.$attrs.value)
          selectedOptions = this.getSelectedOptions()
        }

        // 单选时，将值显示在input中
        this.selectedOptions = selectedOptions
        this.setInputValue('')
      },
      immediate: true
    },
    inputValue () {
      if (!this.focused && this.inputValue) {
        this.focusSelect()
      }
    },
    options () {
      const selectedOptions = this.getSelectedOptions()
      if (selectedOptions.length) {
        this.selectedOptions = selectedOptions
      }
    }
  },
  methods: {
    /**
     * 向创建列表中追加元素
     *
     * @param {string | array} newName
     * @return {void}
     */
    appendCreateList (newName = '') {
      if (newName instanceof Array) {
        return newName.map(this.appendCreateList)
      }
      newName = newName || this.inputValue

      const createListIndex = this.createList.findIndex(
        (item) => item.name === newName
      )

      if (!newName || createListIndex >= 0) {
        return
      }
      this.createList.push({ name: newName, [this.props.value]: -1 })
    },
    /**
     * 返回选中的元素
     *
     * @return {array|object}
     */
    getSelectedOptions () {
      const values = this.$attrs.value instanceof Array ? this.$attrs.value : [this.$attrs.value]

      return this.options
        .concat(this.createList)
        .filter((item) =>
          values.includes(
            this.checkItemIsCreatedByUser(item) ? item.name : item[this.props.value]
          )
        )
    },
    /**
     * 取消选中的元素
     *
     * @param {int} index 被选中元素的索引
     * @return void
     */
    cancelSelect (index) {
      // 如果取消选中的值 是自定义创建的，移除之
      if (this.checkItemIsCreatedByUser(this.selectedOptions[index])) {
        const index = this.createList.findIndex(
          (item) => item.name === this.inputValue
        )
        this.createList.splice(index, 1)
      }

      // 单选相关的操作
      if (!this.multiple) {
        this.setInputValue('')
        this.syncValue('')
        return
      }

      // 多选的操作
      const tempArray = [...this.$attrs.value]
      tempArray.splice(index, 1)
      this.syncValue(tempArray)

      // 如果还有选项，重新聚焦
      this.setInputValue('')
      if (tempArray.length) {
        window.setTimeout(() => {
          this.$refs.input.focus()
        }, 0)
      }
    },
    /**
     * 选中当前元素
     *
     * @param {int} index 被选中元素的索引
     * @return void
     */
    select (index) {
      // 当前被选中的选项
      const currentItem = this.filterItem[index]

      // 没有id的值设置为不能选中
      if (currentItem[[this.props.value]] === false) {
        return
      }

      // 只允许单选
      if (!this.multiple) {
        this.syncValue(
          this.checkItemIsCreatedByUser(currentItem)
            ? currentItem.name
            : currentItem[this.props.value]
        )
        return
      }

      // 超过最大数量的限制
      if (this.$attrs.value.length >= this.maxOptions) {
        return
      }
      // 多选的值
      const result =
        this.$attrs.value instanceof Array ? [...this.$attrs.value] : []

      // id === -1表示选项是用户创建的
      result.push(
        this.checkItemIsCreatedByUser(currentItem)
          ? currentItem.name
          : currentItem[this.props.value] || currentItem
      )

      this.syncValue(result)

      // 重新聚焦input
      this.$refs.input.focus()
    },
    /**
     * 同步父组件的值
     */
    syncValue (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    /**
     * 设置 inputValue
     *
     * @param {any} val
     * @return {void}
     */
    setInputValue (val) {
      if (val === this.inputValue) {
        return
      }
      this.inputValue = val
    },
    /**
     * 判断当前选项是否是用户自己创建的
     *
     * @param {json} item 被检查的选项
     * @return {boolean}
     */
    checkItemIsCreatedByUser (item) {
      return item[this.props.value] === -1
    },
    /**
     * 选中 | 取消选中当前的元素
     *
     * @param {int} index 元素列表中的索引
     * @return void
     */
    toggleItem (index) {
      const currentItem = this.filterItem[index]

      // 如果当前选项被禁用
      if (currentItem.disabled) return

      // 尝试获取被选中元素在 已选元素中的索引
      const selectedIndex = this.checkItemIsSelected(currentItem)
      // 当前元素没有被选中
      if (selectedIndex === false) {
        this.select(index)
      } else {
        // 取消选中的元素
        this.cancelSelect(selectedIndex)
      }

      if (!this.isSelectMultple()) {
        this.hidSlectList()
      }
    },
    /**
     * 判断 当前选项是否被选中
     *
     * @param {json} item
     * @return {boolean}
     */
    checkItemIsSelected (item) {
      const finder = (currentItem) =>
        this.checkItemIsCreatedByUser(currentItem)
          ? item.name === currentItem.name
          : item[this.props.value] === currentItem[this.props.value]
      const index = this.selectedOptions.findIndex(finder)
      return index >= 0 ? index : false
    },
    /**
     * 判断是否是多选
     *
     * @return {boolean}
     */
    isSelectMultple () {
      return this.multiple
    },
    /**
     * 下拉列表聚焦事件
     *
     * @param HTMLEvent
     * @return void
     */
    focusSelect () {
      // 已经聚焦无需重新聚焦
      // 防止手动focus触发该事件
      if (this.focused || !this.filterItem.length) {
        return
      }
      this.setFocusState(true)

      this.showSelectList()
    },
    /**
     * 显示选项列表
     */
    showSelectList () {
      this.$animate(
        this.$refs['ul-wrapper'],
        { ani: 'slideDown', opacity: 1, duration: 251, finish: true },
        (el) => {
          window.addEventListener('click', this.blurSelect)
          el.style.height = 'fit-content'
        }
      )
      this.zIndex = 9999
    },
    /**
     * 下拉列失去焦点事件
     */
    blurSelect (event) {
      if (this.$checkElementAncestor(event.target, this.$el)) {
        return
      }

      this.hidSlectList()
    },
    hidSlectList () {
      this.zIndex = 9998
      this.setFocusState(false)
      this.$animate(
        this.$refs['ul-wrapper'],
        { ani: 'slideUp', opacity: 0, duration: 251 },
        (el) => {
          el.style.height = 'auto'
          el.style.display = 'none'
          this.zIndex = 2
          this.setInputValue('')
        }
      )
      window.removeEventListener('click', this.blurSelect)
    },
    /**
     * 生成tag标签
     * 过滤 &nbsp;
     *
     * @param {Json} item
     * @returns {string}
     */
    generateTag (item) {
      if (!item) {
        return ''
      }
      const tag = item.name || item
      return tag.replace(/&nbsp;/g, '')
    },
    /**
     * 设置是否聚焦的状态
     *
     * @param {boolean} state
     */
    setFocusState (state) {
      this.focused = state
    },
    // 清空所有值
    handleClear () {
      this.syncValue('')
    }
  }
}
</script>

<style lang="scss">
.ui-select {
  display: flex;
  flex-wrap: wrap;
  padding: 0.2rem 0;
  position: relative;
  border-radius: 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
  border: 0.1rem solid #DCDFE6;
  .icofont-tick-mark {
    color: #47d147;
  }
  // 被选中标签样式
  .tag {
    flex: 0.1 1 auto;
    align-self: auto;
    font-size: 1.2rem;
    display: inline-block;
    padding: 0.3rem 0.5rem;
    background-color: #eaeaea;
    color: #666;
    margin: 0.5rem 0.7rem;
    i {
      $size: 1.5rem;
      display: inline-block;
      text-align: center;
      width: $size;
      height: $size;
      vertical-align: middle;
      overflow: hidden;
      line-height: $size - 0.2rem;
      cursor: pointer;
      border-radius: $size;
      font-size: 1.4rem;
      font-style: normal;
      box-sizing: border-box;
      &:hover {
        background-color: #666;
        color: #e6e6e6;
      }
    }
  }
  // 下拉列表输入框的样式
  .input-wrapper {
    flex: 1;
    top: 1rem;
    width: 100%;
    flex-wrap: wrap;
    align-content: stretch;
    justify-content: stretch;
    input {
      z-index: 0;
      width: 1rem;
      color: #666;
      display: flex;
      flex: 1 5 auto;
      align-self: stretch;
      border: 0 !important;
      padding: 0.5rem 0.7rem;
      &::placeholder{
        color: #C0C4CC;
      }
    }
    .el-icon-circle-close{
      cursor: pointer;
      color: #C0C4CC;
      font-size: 1.2rem;
      margin-top: .7rem;
      margin-right: .7rem;
    }
  }
  // 选项列表样式
  .options-wrapper {
    width: 100%;
    display: none;
    max-height: 45rem;
    position: absolute;
    box-shadow: 0 0.12rem .7rem 0 rgba(#c6c6c6, .3);
    top: 2rem;
    border: 0;
    @extend %scroll-bar-min;
    .arrow-top{
      position: absolute;
      width: .7rem;
      height: .7rem;
      border: .1rem solid rgba(#c6c6c6, .3);
      border-left: 0;
      border-top: 0;
      left: 2rem;
      top: -.3rem;
      transform: rotate(225deg);
      &:before {
        content: '';
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        top: -.7rem;
        border-left: .7rem solid transparent;
        border-top: .7rem solid transparent;
        border-bottom: .7rem solid #fff;
      }
    }
    ul {
      top: 1.7rem;
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      list-style: none;
      border-radius: 0.3rem;
      flex-direction: column;
      background-color: #fff;
      justify-content: space-around;
      border: 0.1rem solid #e6e6e6;
      .no-pointer {
        cursor: text;
        color: #999;
        text-align: center;
        background-color: inherit !important;
      }
      li {
        color: #666;
        display: flex;
        padding: 0.5rem;
        cursor: pointer;
        margin: 0.3rem 0;
        transition: background-color .2s;
        justify-content: space-between;
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
  .on {
    color: #409eff;
  }
  .disabled {
    color: #C0C4cc;
    background-color: #f5f7fa !important;
    cursor: not-allowed;
  }
}
.ui-select-on {
  border: 0.1rem solid $blue;
}
</style>
