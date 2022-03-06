<template>
  <!--  专题列表-->
  <base-component :requestApi="requestApi" :showCreate="true">
    <template v-slot:search="{query, getList}">
      <div class="mr-min">
        <div class="flex">
          <v-input v-model="query.name" placeholder="专题名称" theme="box" @change="getList"></v-input>
        </div>
      </div>
    </template>
    <template
      v-slot:create="{ create }"
    >
      <create-topic
        ref="create"
        @create="create"
      />
    </template>
    <template v-slot:default="{ data, edit, create, deleteRecord }">
      <el-table :data="data" border :span-method="spanMethod">
        <el-table-column label="名称" prop="name" align="center">
          <template v-slot="{ row, $index }">
            <create-topic
              v-if="row.editAble"
              predefinedVisible
              style="padding-left: 7rem"
              :origin-model="{ name: row.name, id: row.id }"
              @create="create"
              @close="edit($index)"
            />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章数量" prop="article_sum" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row, $index }">
            <v-button type="primary" text icon="icofont-edit" @click="edit($index)">编辑</v-button>
            <v-button type="danger" text icon="icofont-delete"  @click="deleteRecord(row.id)">删除</v-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </base-component>
</template>

<script>
import createTopic from '~/components/article/topic/create-topic'

const API = '/admin/topic'
export default {
  name: 'topics',
  components: {
    createTopic
  },
  data () {
    return {
      requestApi: API
    }
  },
  methods: {
    /**
     * 获取专题列表
     */
    gettopics (p) {
      this.$store.dispatch('article/gettopics', { vueInstance: this, page: p })
    },
    spanMethod ({ row, columnIndex }) {
      if (row.editAble) {
        return columnIndex === 0 ? { rowspan: 1, colspan: 3 } : { rowspan: 0, colspan: 0 }
      }
      return { rowspan: 1, colspan: 1 }
    }
  }
}
</script>

<style lang="scss">
</style>
