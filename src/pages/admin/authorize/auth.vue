<template>
  <base-component
    :requestApi="requestApi"
    :showCreate="true"
    @updated="updatedCallback"
    hiddenPagination
  >
    <template v-slot:search="{ query }">
      <div class="mr-min">
        <v-input
          placeholder="权限名称"
          theme="box"
          v-model="query.name"
        ></v-input>
      </div>
    </template>
    <template
      v-slot:create="{ create }"
    >
      <create-auth
        ref="create"
        @create="create"
      />
    </template>
    <template v-slot:default="{ data, create, deleteRecord }">
      <div class="sub-container">
        <el-table :data="data" border row-key="id" :tree-props="{ children: 'child' }">
          <el-table-column label="名称" prop="name">
            <template v-slot="{ row }">
              <i v-if="!row.child.length && !row.parent_id">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>{{ row.name }}
            </template>
          </el-table-column>
          <el-table-column label="Route Name" prop="route_name" align="center"></el-table-column>
          <el-table-column label="操作" prop="name" align="center">
            <template v-slot="{ row }">
              <v-button type="primary" text icon="icofont-edit" @click="create(row.id)">编 辑</v-button>
              <v-button type="danger" text icon="icofont-delete" @click="deleteRecord(row.id)">删除</v-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </base-component>
</template>

<script>
import createAuth from '~/components/auth/create'
import searchMixin from '~/mixin/search/search-table-tree'

export default {
  name: 'Auth',
  mixins: [searchMixin],
  data () {
    return {
      selectedIndex: '',
      filter: {
        parent_id: '',
        name: ''
      },
      requestApi: '/admin/auth',
      baseApi: '/admin/auth'
    }
  },
  components: {
    createAuth
  },
  methods: {
    /**
     * 计算字符缩进的个数
     */
    calculateIndent (path) {
      path = path + ''
      return (path.match(/_/g).length - 1) * 2 + 'em'
    },
    /**
     * 修改标签
     *
     * @param {int} index
     * @reutrn void
     */
    edit (index) {
      this.selectedIndex = index
    },
    /**
     * 更新后的操作，刷新当前页面
     */
    updatedCallback () {
      this.$children[0].reload()
    }
  }
}
</script>

<style lang="scss">
.auth-table-name {
  padding-left: 0.7rem;
}
.search-auth{
  align-items: center;
}
</style>
