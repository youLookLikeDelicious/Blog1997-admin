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
      handler () {
        this.defaultChecked.forEach(nodeId => {
          this.$set(this.nodeMap[nodeId], 'checked', nodeId)
        })
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
    }
  }
}
</script>

<style>

</style>
