<template>
  <!-- 友情链接的列表信息 -->
  <base-component :requestApi="requestApi" :showCreate="true">
    <!-- 搜索 begin -->
    <template v-slot:search="{ query, getList }">
      <v-input v-model="query.name" @change="getList" placeholder="名称" theme="box"></v-input>
    </template>
    <!-- 搜索 end -->
    <!-- 新建友链 -->
    <template v-slot:create="{ create }">
      <create-friendLink
        ref="create"
        @create="create"
      />
    </template>
    <!-- 列表部分 -->
    <template v-slot:default="{ data, deleteRecord, create, edit }">
      <el-table :data="data" border :span-method="spanMethod">
        <el-table-column label="名称" prop="name" align="center">
          <template v-slot="{ row, $index }">
            <span v-if="!row.editAble">{{ row.name }}</span>
            <create-friendLink
              v-else
              style="padding-left: 5.2rem"
              :originModel="{ id: row.id, name: row.name, url: row.url }"
              predefinedVisible
              @create="create"
              @close="edit($index)" />
          </template>
        </el-table-column>
        <el-table-column label="URL" prop="url" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row, $index }">
            <v-button type="primary" text @click="edit($index)" icon="el-icon-edit">编辑</v-button>
            <v-button type="danger" text @click="deleteRecord(row.id)" icon="el-icon-delete">删除</v-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </base-component>
</template>

<script>
import createFriendLink from '~/components/friend-link/create'
export default {
  name: 'FriendLinkList',
  components: {
    createFriendLink
  },
  props: {
    linkList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      showCreateFriendLinkBtn: false,
      filter: {
        name: ''
      },
      requestApi: '/admin/friend-link',
      baseApi: '/admin/friend-link'
    }
  },
  methods: {
    spanMethod ({ row, columnIndex }) {
      if (row.editAble) {
        return columnIndex === 0 ? { rowspan: 1, colspan: 4 } : { rowspan: 0, colspan: 0 }
      }
      return { rowspan: 1, colspan: 1 }
    }
  }
}
</script>

<style lang="scss">
.create-friend-link-wrap {
  display: flex;
  align-items: center;
}
</style>
