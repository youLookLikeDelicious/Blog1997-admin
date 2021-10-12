<template>
  <base-component ref="base" :request-api="requestApi" :showCreate="true" :forceRenderContent="true">
    <!-- 搜索部分 begin -->
    <template v-slot:search="{ data, batchDelete, meta }">
      <el-col :span="4">
        <v-input theme="box" v-model="filter.word" placeholder="敏感词"></v-input>
      </el-col>
      <el-col :span="5">
        <div class="inline-block ml-min">
          <v-select v-model="filter.category_id" placeholder="分类" :options="meta.categoryList" />
        </div>
      </el-col>
    </template>
    <template v-slot:rightButton="{ handleShowCreate }">
      <el-col class="right-btn">
        <v-button type="primary" icon="icofont-upload-alt" @click="handleImport">导 入</v-button>
        <v-button type="primary" icon="icofont-ui-edit" @click="handleShowCreate">新 建</v-button>
      </el-col>
    </template>
    <!-- 搜索部分 end -->
    <!-- 提交新的敏感词 begin -->
    <template v-slot:create="{ create, meta }">
      <createSensitiveWord
        :categoryList="meta.categoryList"
        ref="create"
        @create="create"
      />
    </template>
    <!-- 提交新的敏感词 end -->
    <template
      ref="slotRef"
      v-slot:default="{
        meta,
        data,
        edit,
        create,
        getList,
        selectAll,
        hasSelectAll,
        deleteRecord
      }"
    >
      <!-- 数据列表部分 -->
      <el-table :data="data" border :span-method="spanMethod">
        <el-table-column label="敏感词" prop="word" align="center">
          <template v-slot="{ row, $index }">
            <span v-if="!row.editAble">{{ row.word }}</span>
            <createSensitiveWord
              v-else
              predefinedVisible
              :categoryList="meta.categoryList"
              :originModel="{ word: row.word, category_id: row.category_id, id: row.id }"
              @create="create"
              @close="edit($index)"
            />
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="category_name" align="center"></el-table-column>
        <el-table-column label="屏蔽方式" prop="rank_text" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row, $index }">
            <v-button type="primary" text icon="icofont-ui-edit" @click="edit($index)">编 辑</v-button>
            <v-button type="danger" text icon="icofont-ui-delete" @click="deleteRecord(row.id)">删 除</v-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑敏感词和导入对话框 begin -->
      <import-dialog
        ref="import"
        @create="create"
        :getList="getList"
        :category-list="meta.categoryList"
        @imported="getList"
      />
    </template>
  </base-component>
</template>

<script>
import importDialog from '~/components/sensitive-word/import'
import createSensitiveWord from '~/components/sensitive-word/create'
const requestApi = '/admin/sensitive-word'

export default {
  name: 'SensitiveWordIndex',
  components: {
    importDialog,
    createSensitiveWord
  },
  data () {
    return {
      filter: {
        category_id: 0,
        word: ''
      },
      requestApi: requestApi,
      baseApi: requestApi
    }
  },
  methods: {
    // 导入
    handleImport () {
      this.$refs.import.handleVisible()
    },
    // 合并列
    spanMethod ({ row, columnIndex }) {
      if (row.editAble) {
        return columnIndex === 0 ? { rowspan: 1, colspan: 5 } : { rowspan: 0, colspan: 0 }
      }
      return { rowspan: 1, colspan: 1 }
    }
  }
}
</script>

<style lang="scss">
.sensitive-word-tool-bar {
  align-items: center;
}
</style>
