/**
 * Table树的前端搜索
 */
const TableTreeSearchMixin = {
  methods: {
    /**
     * 判断Tr是否是顶级节点
     *
     * @param tr tr元素
     * @return {Boolean}
     */
    isTopNode (tr) {
      return tr.classList.contains('el-table__row--level-0') || tr.className === 'el-table__row'
    },
    // 获取tr的层级
    getTrLevel (tr) {
      const trLevel = tr.className.match(/el-table__row--level-(\d+)/)
      const currentLevel = trLevel ? +trLevel[1] : 0
      return currentLevel
    },
    search (query) {
      // 获取tr
      const trs = this.$el.querySelectorAll('tr.el-table__row')

      // 搜索内容为空，恢复初始状态
      if (query.name === '' || typeof query.name === 'undefined') {
        for (let i = 0, len = trs.length; i < len; i++) {
          const list = trs[i].classList
          if ((list.contains('el-table__row') && list.length === 1) || (list.contains('el-table__row--level-0'))) {
            trs[i].style.display = ''
            const el = trs[i].querySelector('.el-table__expand-icon')
            if (el && el.classList.contains('el-table__expand-icon--expanded')) {
              el.classList.remove('el-table__expand-icon--expanded')
            }
          } else {
            trs[i].style.display = 'none'
          }
        }
        return
      }

      let showEl = false
      const name = query.name.toLocaleLowerCase()
      // 当前匹配元素的层级
      let currentLevel

      // 从最后一个元素判断显隐
      for (let i = trs.length - 1, len = 0; i >= len; i--) {
        // 控制展开样式的元素
        const el = trs[i].querySelector('.el-table__expand-icon')
        // 匹配的结果
        const matchResult = trs[i].querySelector('td').innerHTML.replace(/<[^>]*>/g, '').toLocaleLowerCase().includes(name)

        if (!showEl && matchResult) {
          showEl = true
          currentLevel = this.getTrLevel(trs[i])
        }

        const tmpLevel = this.getTrLevel(trs[i])
        // 展示匹配的元素 及其父元素
        if (showEl && (tmpLevel < currentLevel || matchResult)) {
          trs[i].style.display = ''
          if (el && !el.classList.contains('el-table__expand-icon--expanded')) {
            el.classList.add('el-table__expand-icon--expanded')
          }
          if (tmpLevel < currentLevel) {
            --currentLevel
          }
        } else {
          // 隐藏当前元素
          trs[i].style.display = 'none'
          if (el && el.classList.contains('el-table__expand-icon--expanded')) {
            el.classList.remove('el-table__expand-icon--expanded')
          }
        }

        if (showEl && this.isTopNode(trs[i])) {
          showEl = false
          currentLevel = 0
        }
      }
    }
  }
}

export default TableTreeSearchMixin
