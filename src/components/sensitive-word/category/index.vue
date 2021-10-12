<template>
  <base-component :request-api="requestApi" :showCreate="true">
    <!-- 搜索 begin -->
    <template v-slot:search>
      <div class="mr-min">
        <v-input
          theme="box"
          v-model="filter.name"
          placeholder="分类名称"
        ></v-input>
      </div>
      <v-select
        :options="shieldLevel"
        v-model="filter.rank"
        placeholder="屏蔽级别"
      ></v-select>
    </template>
    <!-- 搜索 end -->
    <!-- 新建分类 begin -->
    <template v-slot:create="{ create, meta }">
      <createCategory
        ref="create"
        :categoryList="meta.categoryList"
        @create="create"
        :shield-level="shieldLevel"
      />
    </template>
    <!-- 列表部分 -->
    <template v-slot:default="{ data, deleteRecord, edit, create, meta }">
      <el-table :data="data" border :span-method="spanMethod">
        <el-table-column label="分类名称" prop="name" align="center">
          <template v-slot="{ row, $index }">
            <span v-if="!row.editAble">
              {{ row.name }}
            </span>
            <createCategory
              v-else
              :categoryList="meta.categoryList"
              predefinedVisible
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
            <v-button type="primary" text @click="edit($index)">编 辑</v-button>
            <v-button type="danger" text @click="deleteRecord(row.id)">删 除</v-button>
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
      filter: {
        name: '',
        rank: 0
      },
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
