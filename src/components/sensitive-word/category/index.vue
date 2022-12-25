<template>
  <base-component :request-api="requestApi" :showCreate="true">
    <!-- 搜索 begin -->
    <template v-slot:search="{query, getList}">
      <el-col :span="4">
        <v-input
          theme="box"
          v-model="query.name"
          placeholder="分类名称"
          @change="getList"
        ></v-input>
      </el-col>
      <el-col :span="4">
        <v-select
          :options="shieldLevel"
          v-model="query.rank"
          clearable
          placeholder="屏蔽级别"
          @change="getList"
        ></v-select>
      </el-col>
    </template>
    <!-- 搜索 end -->
    <!-- 新建分类 begin -->
    <template v-slot:create="{ create }">
      <createCategory
        ref="create"
        @create="create"
        :shield-level="shieldLevel"
      />
    </template>
    <!-- 列表部分 -->
    <template v-slot:default="{ data, deleteRecord, edit, create }">
      <el-table :data="data" border :span-method="spanMethod">
        <el-table-column label="分类名称" prop="name" align="center">
          <template v-slot="{ row, $index }">
            <span v-if="!row.editAble">
              {{ row.name }}
            </span>
            <createCategory
              v-else
              predefinedVisible
              :originModel="{ name: row.name, rank: row.rank, id: row.id }"
              @create="create"
              @close="edit($index)"
              :shield-level="shieldLevel"
            />
          </template>
        </el-table-column>
        <el-table-column label="屏蔽方式" prop="name" align="center">
          <template v-slot="{ row }">
            {{ row.rank | sensitiveWordRank }}
          </template>
        </el-table-column>
        <el-table-column label="敏感词数量" prop="name" align="center">
          <template v-slot="{ row }">
            {{ row.count || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row, $index }">
            <v-button type="primary" icon="icofont-edit" text @click="edit($index)">编 辑</v-button>
            <v-button type="danger" text icon="icofont-delete" @click="deleteRecord(row.id)">删 除</v-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </base-component>
</template>

<script>
import createCategory from '~/components/sensitive-word/category/create'

const shieldLevel = [
  { id: 1, name: '替换' },
  { id: 2, name: '审核' },
  { id: 3, name: '屏蔽' }
]
export default {
  name: 'SensitiveWordCategory',
  components: {
    createCategory
  },
  data () {
    return {
      showCreateCategory: false,
      requestApi: '/admin/sensitive-word-category',
      baseApi: '/admin/sensitive-word-category',
      shieldLevel
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
</style>
