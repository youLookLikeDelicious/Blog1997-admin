<template>
  <base-component :requestApi="requestApi" :showCreate="true">
    <template v-slot:search="{ query, getList }">
      <div>
        <v-input v-model="query.name" theme="box" @change="getList" placeholder="角色名称"></v-input>
      </div>
    </template>
    <template
      v-slot:create="{ create }"
    >
      <create-role
        ref="create"
        @create="create"
      />
    </template>
    <template v-slot:default="{ data, handleShowCreate, deleteRecord }">
      <el-table :data="data" border>
        <el-table-column label="角色名称" prop="name" align="center"></el-table-column>
        <el-table-column label="备注" prop="remark" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <v-button type="primary" text icon="icofont-edit" @click="handleShowCreate(row.id)">编辑</v-button>
            <v-button type="danger" text icon="icofont-delete" @click="deleteRecord(row.id)">删除</v-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </base-component>
</template>

<script>
import createRole from '~/components/role/create'

export default {
  name: 'Role',
  components: {
    createRole
  },
  data () {
    return {
      filter: {
        name: ''
      },
      requestApi: '/admin/role',
      baseApi: '/admin/role'
    }
  },
  methods: {
    /**
     * 修改标签
     *
     * @param {int} index
     * @reutrn void
     */
    edit (index) {
      this.selectedIndex = index
      const authorities = this.$children[0].requestResult.records[index].authorities.map(item => item.id)
      this.$store.commit('auth/setSelectedList', authorities)
    }
  }
}
</script>

<style lang="scss">
</style>
