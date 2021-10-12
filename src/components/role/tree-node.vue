<template>
  <transition v-on:enter="enter" v-on:leave="leave">
    <ul class="tree-list" v-show="visibility">
      <li
        v-for="(leaf, index) in tree"
        :key="index"
        :style="{
          'padding-left': deepth * 2 + 'em',
        }"
      >
        <div class="tree-node">
          <v-button v-if="leaf.child"
            type="text"
            :icon="'icofont-caret-down ' + (visibleleafStack.includes(index) ? 'list-slide-up' : 'list-slide-down')"
            @click="toggleleaf(index)"
            ></v-button>
          <span v-else class="no-child"></span>
          <v-checkbox
            :label="leaf.id"
            v-model="leaf.checked"
            :indeterminate="leaf.indeterminate"
            @change="handleCheckboxChange"
          />
          <!-- :selected-state="computeSelectState(leaf)" -->
          <span>{{ leaf.name }}</span>
        </div>

        <auth-tree
          v-if="leaf.child"
          :tree="leaf.child"
          :visibility="isVisible(index)"
          :deepth="deepth + 1"
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
    deepth: {
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
    }
  },
  data () {
    return {
      rootTree: '', // 递归组件的根节点
      visibleleafStack: [] // 保存子树的显隐状态
    }
  },
  created () {
    this.rootTree = this.deepth ? this.$parent.rootTree : this.$parent
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
      this.$animate(el, { ani: 'slideUp', duration: 168 }, done)
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
      if (leaf.child) {
        const traverse = (node, checked) => {
          if (!node) return
          node.forEach(item => {
            if (!checked && item.checked) {
              this.$set(item, 'checked', '')
            } else if (checked && !item.checked) {
              this.$set(item, 'checked', item.id)
            }
            traverse(item.child, checked)
          })
        }
        traverse(leaf.child, val)
      }

      if (!this.deepth) return
      this.$emit('change', { parentId: leaf.parent_id })
    },
    // 处理子节点修改事件
    handleChildChange ({ parentId }) {
      // 获取当前节点
      const leaf = this.tree.find(item => item.id === parentId)
      // 选中操作,计算父节点的选中状态
      let selectedNum = 0; let indeterminateNum = 0

      leaf.child.forEach(item => {
        if (item.checked) ++selectedNum
        if (item.indeterminate) ++indeterminateNum
      })
      const isIndeterminate = Boolean((selectedNum && selectedNum < leaf.child.length) || indeterminateNum)
      this.$set(leaf, 'indeterminate', isIndeterminate)
      this.$set(leaf, 'checked', selectedNum === leaf.child.length ? leaf.id : false)

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
    padding: 0.3rem;
    height: 3rem;
    box-sizing: border-box;
    line-height: 3rem;
    transition: background-color .3s;
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
    width: 2em;
    margin-right: 0.7rem;
    display: inline-block;
  }
}
</style>
