<template>
  <tree-node :tree="tree" :render-content="renderContent" childrenKey="child" :show-checkbox="showCheckbox"></tree-node>
</template>

<script>
import TreeNode from './tree-node.vue'

export default {
  components: { TreeNode },
  props: {
    tree: {
      type: Array,
      default () {
        return []
      }
    },
    // 默认选中的选项
    defaultChecked: {
      type: Array,
      default () {
        return []
      }
    },
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default () {
        return true
      }
    },
    childrenKey: {
      type: String,
      default () {
        return 'children'
      }
    }
  },
  data () {
    return {
      watchNode: '',
      checkedIds: []
    }
  },
  computed: {
    // 将树形结构转为一维数组
    nodeMap () {
      const map = {}
      const traverse = function (tree) {
        if (!tree) return
        tree.forEach(node => {
          map[node.id] = node
          if (node.child) {
            traverse(node.child)
          }
        })
      }

      traverse(this.tree)
      return map
    }
  },
  watch: {
    defaultChecked: {
      handler (val) {
        const mapLength = Object.keys(this.nodeMap).length
        if (!val || !mapLength) {
          // 处理defaultChecked比tree先赋值的问题
          if (!mapLength && !this.watchNode) {
            this.watchNode = this.$watch('nodeMap', _ => {
              this.syncDefaultSelected()
              this.watchNode()
              this.watchNode = ''
            })
          }
          return
        }
        this.syncDefaultSelected()
      },
      immediate: true
    }
  },
  methods: {
    getCheckedValues () {
      const arr = []
      const travel = function (node) {
        if (!node) return
        node.forEach(item => {
          if (item.checked) {
            arr.push(item.id)
          }
          travel(item.child)
        })
      }
      travel(this.tree)
      return arr
    },
    syncDefaultSelected () {
      this.defaultChecked.forEach(nodeId => {
        this.$set(this.nodeMap[nodeId], 'checked', nodeId)
      })
    }
  }
}
</script>

<style>

</style>
