<template>
  <transition v-on:enter="enter" v-on:leave="leave">
    <ul class="tree-list" v-show="visibility">
      <li
        v-for="(leaf, index) in tree"
        :key="index"
      >
        <div class="tree-node">
          <span :style="{ width: depth * 2 + 'em', display: 'inline-block'}"></span>
          <v-button v-if="leaf[childrenKey]"
            type="text"
            :icon="'icofont-caret-down ' + (visibleleafStack.includes(index) ? 'list-slide-up' : 'list-slide-down')"
            @click="toggleleaf(index)"
            ></v-button>
          <span v-else :class="{'no-child': true, 'first-no-child': !depth}"></span>
          <v-checkbox
            v-if="showCheckbox"
            :label="leaf.id"
            v-model="leaf.checked"
            :indeterminate="leaf.indeterminate"
            @change="handleCheckboxChange"
          />
          <span v-else>&nbsp;</span>
          <!-- :selected-state="computeSelectState(leaf)" -->
          <node-content :node="leaf"></node-content>
        </div>

        <auth-tree
          v-if="leaf[childrenKey]"
          :tree="leaf[childrenKey]"
          :visibility="isVisible(index)"
          :depth="depth + 1"
          :show-checkbox="showCheckbox"
          :render-content="renderContent"
          @change="handleChildChange"
        ></auth-tree>
      </li>
    </ul>
  </transition>
</template>

<script>

export default {
  name: 'AuthTree',
  props: {
    tree: {
      type: Array,
      default () {
        return []
      }
    },
    /**
     * 递归的深度
     */
    depth: {
      type: [Number, String],
      default () {
        return 0
      }
    },
    /**
     * 是否显示子元素
     */
    visibility: {
      type: Boolean,
      default () {
        return true
      }
    },
    showCheckbox: Boolean,
    renderContent: Function
  },
  components: {
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render (h) {
        const parent = this.$parent
        const node = this.node
        return parent.renderContent
          ? parent.renderContent.call(parent._renderProxy, h, { context: parent.$vnode.context, node })
          : h('span', node.name)
      }
    }
  },
  data () {
    return {
      childrenKey: 'children',
      rootTree: '', // 递归组件的根节点
      visibleleafStack: [] // 保存子树的显隐状态
    }
  },
  created () {
    this.rootTree = this.depth ? this.$parent.rootTree : this.$parent
    if (this.childrenKey !== this.rootTree.childrenKey) {
      this.childrenKey = this.rootTree.childrenKey
    }
  },
  methods: {
    /**
     * 展开或隐藏子元素
     *
     * @param {int} index
     * @return {void}
     */
    toggleleaf (index) {
      const stackIndex = this.visibleleafStack.indexOf(index)
      // 加入链表
      if (stackIndex === -1) {
        this.visibleleafStack.push(index)
      } else {
        // 从链表中删除
        this.visibleleafStack.splice(stackIndex, 1)
      }
    },
    /**
     * 判断是否显示子元素
     *
     * @return {boolearn}
     */
    isVisible (index) {
      return this.visibleleafStack.indexOf(index) >= 0
    },
    /**
     * 显示子树的动画
     *
     * @param {HTMLElement} el
     * @param {Function} done
     * @return {void}
     */
    enter (el, done) {
      this.$animate(el, { ani: 'slideDown', duration: 168 }, (el) => {
        el.style.height = 'fit-content'
        done()
      })
    },
    /**
     * 隐藏子树的动画
     *
     * @param {HTMLElement} el
     * @param {Function} done
     * @return {void}
     */
    leave (el, done) {
      const height = this.$animate.css(el, 'height')
      this.$animate(el, { ani: 'slideUp', duration: 168 }, el => {
        el.setAttribute('slideto', height)
        done()
      })
    },
    // checkbox修改事件
    handleCheckboxChange (val, preVal) {
      // 获取当前的叶子节点
      const id = val || preVal
      const leaf = this.tree.find(item => item.id === id)
      if (leaf.indeterminate && val) {
        this.$set(leaf, 'indeterminate', false)
      }

      // 修改子节的的状态
      if (leaf[this.childrenKey]) {
        const traverse = (node, checked) => {
          if (!node) return
          node.forEach(item => {
            if (!checked && item.checked) {
              this.$set(item, 'checked', '')
            } else if (checked && !item.checked) {
              this.$set(item, 'checked', item.id)
            }
            traverse(item[this.childrenKey], checked)
          })
        }
        traverse(leaf[this.childrenKey], val)
      }

      if (!this.depth) return
      this.$emit('change', { parentId: leaf.parent_id })
    },
    // 处理子节点修改事件
    handleChildChange ({ parentId }) {
      // 获取当前节点
      const leaf = this.tree.find(item => item.id === parentId)
      // 选中操作,计算父节点的选中状态
      let selectedNum = 0; let indeterminateNum = 0

      leaf[this.childrenKey].forEach(item => {
        if (item.checked) ++selectedNum
        if (item.indeterminate) ++indeterminateNum
      })
      const isIndeterminate = Boolean((selectedNum && selectedNum < leaf[this.childrenKey].length) || indeterminateNum)
      this.$set(leaf, 'indeterminate', isIndeterminate)
      this.$set(leaf, 'checked', selectedNum === leaf[this.childrenKey].length ? leaf.id : false)

      // 修改父节点的状态
      if (!leaf.parent_id) return
      this.$emit('change', { parentId: leaf.parent_id })
    }
  }
}
</script>

<style lang="scss">
.tree-list {
  list-style: none;
  overflow: hidden;
  li {
    margin: 0.3rem 0;
  }
  .tree-node {
    width: 100%;
    display: flex;
    align-items: center;
    height: 3.5rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    transition: background .3s;
    &:hover {
      background-color: $hover-color;
    }
  }
  .icon {
    display: inline-block;
    transition: transform 0.5s;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    font-size: 1.6rem;
    text-align: center;
    box-sizing: border-box;
    color: #c0c4cc;
  }
  .list-slide-down {
    color: #999;
    display: inline-block;
    transform: rotate(-90deg);
  }
  .list-slide-up {
    color: #999;
    display: inline-block;
    transform: rotate(0);
  }
  .no-child {
    height: 2rem;
    width: 0;
    margin-right: 0.7rem;
    display: inline-block;
  }
  .first-no-child{
    width: .7em;
  }
  .v-button:not(first-child){
    margin-left: 0;
  }
}
</style>
