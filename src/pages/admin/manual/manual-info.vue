<template>
  <div class="manual-info-wrapper">
    <header class="header">
      <router-link to="/manual"><i class="icofont-rounded-double-left"></i> 手册列表</router-link>
      <div>
        <!-- <v-button icon="icofont-share">分享</v-button> -->
        <v-drop-down>
          <v-button ref="newBtn" icon="icofont-focus" class="btn-enable">新建</v-button>
          <template slot="drop-down">
            <ul>
              <li @click="handleCreateCatalog(0, 2)"><i class="iconfont icon-24"></i>新建文档</li>
              <li @click="handleCreateCatalog(0, 1)"><i class="iconfont icon-mulu"></i>新建章节</li>
              <!-- <li @click="handleImport"><i class="iconfont icon-daoru"></i>导入</li> -->
            </ul>
          </template>
        </v-drop-down>
      </div>
    </header>
    <el-divider><span></span></el-divider>
    <h2>{{ manualInfo.name }}</h2>
    <div class="manual-menu">
      <div class="menu-box">
        <span>目录</span>
        <div class="top-btn">
        </div>
      </div>
    </div>
    <article>
      <section>
        <!-- <div class="summary-node" @mouseenter="showSubMenu = true" @mouseleave="showSubMenu = false">
          <span><i class="icofont-attachment"></i>简介</span>
          <el-dropdown v-show="showSubMenu" @command="handleUpdateSummary">
            <i class="iconfont icon-2601caidan2"></i>
            <el-dropdown-menu>
              <el-dropdown-item command="createDoc">编辑内容</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
        <el-tree ref="tree"
          draggable
          node-key="id"
          @node-drop="handleDrop"
          :allow-drop="allowDrop"
          :data="manualInfo.catalogs"
          :default-expanded-keys="autoExpandKeys"
          :render-content="renderCatalogContent" />
      </section>
    </article>
    <create-catalog ref="createCatalog" :catalogs="catalogs" @success="getManualInfo"></create-catalog>
  </div>
</template>

<script>
import CreateCatalog from './components/create-catalog'
import { getManualInfo, saveCatalog, deleteCatalog } from '~/api/manual'

// 节点类型是文章
const CATALOG_TYPE = 1
export default {
  layout: 'pure',
  components: { CreateCatalog },
  data () {
    return {
      timer: '',
      manualInfo: '',
      autoExpandKeys: [],
      showSubMenu: false
    }
  },
  created () {
    this.getManualInfo()
  },
  computed: {
    catalogs () {
      if (!this.manualInfo.catalogs) return []
      const catalogs = []
      const handler = function (origin, filtered) {
        origin.forEach(item => {
          if (item.type !== CATALOG_TYPE) {
            return
          }
          const { id, name } = item
          const append = { id, name }
          filtered.push(append)
          if (item.children) {
            append.children = []
            handler(item.children, append.children)
            if (!append.children.length) {
              append.children = null
            }
          }
        })

        return filtered
      }

      return handler(this.manualInfo.catalogs, catalogs)
    }
  },
  methods: {
    // 获取手册详情
    getManualInfo () {
      const { id = '' } = this.$route.params
      getManualInfo(id, { with_catalogs: 1, id: -1 })
        .then(res => {
          // res.data.data.catalogs.unshift({ name: '简介', type: '-1' })
          this.manualInfo = res.data.data
          this.autoExpandKeys = this.manualInfo ? [this.manualInfo.id] : []
        })
    },
    // 新建文档
    handleCreateDoc () {
    },
    // 新建目录(有对话框)
    handleCreateCatalog (id, type = 1) {
      this.$refs.createCatalog.handleVisible(id, type)
    },
    // 导入
    handleImport () {

    },
    // 渲染章节节点
    renderCatalogContent (h, { data, _self }) {
      let children

      if (!data.originName) {
        data.originName = data.name
      }
      const handleVisibleChange = val => {
        _self.$set(data, 'dropDownIsShow', val)
        if (!val && data.showButtons) {
          setTimeout(_ => {
            _self.$set(data, 'showButtons', false)
          }, 210)
        }
      }

      // 右侧部分
      if (data.showButtons) {
        const operateMenu = [
          h('el-dropdown-item', { props: { command: 'rename' } }, [h('span', { domProps: { innerHTML: ' 重命名' } })]),
          h('el-dropdown-item', { props: { command: 'delete' } }, [h('span', { domProps: { innerHTML: ' 删除' } })])
        ]

        if (data.type === 2) {
          operateMenu.push(h('el-dropdown-item', { props: { command: 'createDoc' } }, [h('span', { domProps: { innerHTML: ' 编辑内容' } })]))
        }

        children = h('div', [
          h('el-dropdown', {
            style: {
              display: data.type === 1 ? '' : 'none'
            },
            on: {
              'visible-change': handleVisibleChange,
              command: command => this.handleCommand(command, data, _self)
            }
          }, [
            h('i', {
              class: 'iconfont icon-plus',
              on: {
                click: e => {
                  e = e || window.event
                  e.stopPropagation()
                }
              }
            }),
            h('el-dropdown-menu', { slot: 'dropdown' }, [
              h('el-dropdown-item', { props: { command: 'createDoc' } }, [h('span', { domProps: { innerHTML: ' 新建文档' } })]),
              h('el-dropdown-item', { props: { command: 'createSection' } }, [h('span', { domProps: { innerHTML: ' 新建章节' } })])
            ]
            )
          ]),
          h('el-dropdown', {
            on: {
              'visible-change': handleVisibleChange,
              command: command => this.handleCommand(command, data, _self)
            }
          }, [
            h('i', {
              class: 'iconfont icon-2601caidan2',
              on: {
                click: e => {
                  e = e || window.event
                  e.stopPropagation()
                }
              }
            }),
            h('el-dropdown-menu', { slot: 'dropdown' }, operateMenu
            )
          ])
        ])
      } else {
        children = h('em', { class: 'update-at' }, data.updated_at)
      }

      const nameEl = data.showEdit
        ? h('v-input', {
          attrs: {
            value: data.name
          },
          props: {
            placeholder: '名称',
            autoFocus: true
          },
          on: {
            input: name => {
              if (name && name === data.name) return
              data.name = name
            },
            blur: _ => {
              if (data.name !== this.originName) {
                this.handleSaveCatalog(data)
              }
            }
          }
        })
        : h('span', [h('i', { class: { 1: 'icofont-sub-listing', 2: 'icofont-underline', '-1': 'icofont-attachment' }[data.type] }), h('em', data.name)])
      return h('div', {
        class: 'catalog-content',
        on: {
          mouseenter: _ => {
            _self.$set(data, 'showButtons', true)
          },
          mouseleave: _ => {
            if (data.dropDownIsShow) return
            _self.$set(data, 'showButtons', false)
          }
        }
      }, [
        nameEl,
        children
      ])
    },
    // 处理节点中下拉按钮的命令
    handleCommand (command, data, context) {
      switch (command) {
        case 'createDoc':
          const params = { manual_id: this.manualInfo.id }
          const query = { }
          if (data.type === 2) {
            params.id = data.id
          } else {
            query.parent_id = data.id
          }

          this.$router.push({ name: 'manual-article', params, query })
          break
        case 'createSection':
          this.handleCreateNewCatalog(data, 1, context)
          break
        case 'rename':
          context.$set(data, 'showEdit', true)
          break
        case 'delete':
          this.handleDeleteCatalog(data)
          break
      }
    },
    // 新建目录(无对话框)
    handleCreateNewCatalog (data, type, context) {
      if (!data.children) {
        context.$set(data, 'children', [])
      }
      this.autoExpandKeys = [data.id]
      data.children.push({
        type,
        name: '',
        is_public: 1,
        parent: data,
        updated_at: '',
        showEdit: true,
        parent_id: data.id,
        manual_id: this.manualInfo.id
      })
    },
    // 保存节点
    handleSaveCatalog (data) {
      if (!data.name) {
        if (!data.id) {
          const index = data.parent.children.findIndex(item => item === data)
          data.parent.children.splice(index, 1)
        }
        data.name = data.originName
        data.showEdit = false
        return
      }
      saveCatalog(data).then(_ => {
        if (data.showEdit) {
          data.showEdit = false
        }
      })
    },
    // 删除章节
    handleDeleteCatalog ({ id, type, children }) {
      // 删除章节
      if (type === 1) {
        if (children) {
          this.$setMessage({ msg: '该章节下还有内容,无法删除', status: false })
          return
        }
      }
      deleteCatalog(id).then(_ => {
        this.getManualInfo()
      })
    },
    // 处理drop事件
    handleDrop (currentNode, interactNode, dropType) {
      let { manual_id, is_public, pre_node_id, next_node_id, parent_id, id: interactNodeId } = interactNode.data
      const { id, name } = currentNode.data
      switch (dropType) {
        case 'after':
          next_node_id = undefined
          pre_node_id = interactNodeId
          break
        case 'before':
          pre_node_id = undefined
          next_node_id = interactNodeId
          break
        case 'inner':
          pre_node_id = undefined
          next_node_id = undefined
          parent_id = interactNodeId
          break
      }

      this.handleSaveCatalog({ name, manual_id, is_public, pre_node_id, next_node_id, parent_id, id })
    },
    allowDrop (draggingNode, dropNode, type) {
      if (type === 'inner' && dropNode.data.type === 2) {
        return false
      }
      return true
    },
    // 修改简介
    handleUpdateSummary () {

    }
  }
}
</script>

<style lang="scss" scoped>
.manual-info-wrapper{
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  h2 {
    text-align: center;
    margin-top: 2.1rem;
  }
  article {
    margin: 0 auto;
    max-width: 85rem;
  }
  .manual-menu{
    .menu-box {
      display: flex;
      margin: 0 auto;
      max-width: 85rem;
      align-items: bottom;
      margin: 2.1rem auto;
      padding-bottom: 1.2rem;
      box-shadow: 0 1px 0 #f0f0f0;
      justify-content: space-between;
    }
  }
  ul {
    color: #666;
    list-style: none;
  }
  .header{
    color: #666;
    display: flex;
    padding: .7rem 3rem 0 3rem;
    margin: 1rem auto 0 auto;
    justify-content: space-between;
  }
  :deep(.el-divider--horizontal) {
    margin-top: 1.7rem;
  }
  :deep(.catalog-content) {
    flex: 1;
    display: flex;
    align-self: stretch;
    align-items: center;
    justify-content: space-between;
    .iconfont, .icofont-underline, .icofont-sub-listing {
      color: #999;
      cursor: pointer;
      margin-right: .4rem;
    }
    .icofont-underline, .icofont-sub-listing{
      font-size: 1.2rem;
    }
    em {
      margin-left: .3rem;
      font-style: normal;
    }
  }
  :deep(.el-tree-node__content) {
    padding-top: .5rem;
    padding-bottom: .5rem;
    border-radius: .3rem;
    transition: background-color .3s;
    .update-at{
      color: #999;
      font-size: 1.4rem;
    }
    &:hover {
      background-color: rgba($blue, .2);
    }
  }
  // .summary-node {
  //   display: flex;
  //   height: 3.6rem;
  //   cursor: pointer;
  //   overflow: hidden;
  //   align-items: center;
  //   border-radius: .3rem;
  //   box-sizing: border-box;
  //   transition: background .3s;
  //   padding: 0 .4rem 0 1.5em;
  //   justify-content: space-between;
  //   &:hover {
  //     background-color: rgba($blue, .2);
  //   }
  //   .iconfont {
  //     color: #999;
  //     cursor: pointer;
  //   }
  //   .icofont-attachment{
  //     margin-right: .3rem;
  //   }
  // }
}
</style>
