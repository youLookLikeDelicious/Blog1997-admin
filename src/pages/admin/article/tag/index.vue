<template>
  <base-component :requestApi="requestApi" :showCreate="true">
    <!-- 搜索 begin -->
    <template v-slot:search="{ query, getList }">
      <v-input v-model="query.name" @change="getList" placeholder="名称" theme="box" />
    </template>
    <!-- 搜索 end -->
    <template v-slot:create="{ create }">
      <create-tag
        ref="create"
        @create="create" />
    </template>
    <!-- 列表部分 -->
    <template v-slot:default="{ data, deleteRecord, handleShowCreate }">
      <el-table :data="data" border row-key="id" :tree-props="{children: 'child'}">
        <el-table-column label="名称" prop="name" align="left">
          <template v-slot="{ row }">
            <span v-if="!row.child || !row.child.length" style="margin-left: 2em"></span>
            {{row.name}}
          </template>
        </el-table-column>
        <el-table-column label="封面" align="center">
          <template v-slot="{ row }">
            <el-image :src="row.cover" style="width: 5rem">
              <div slot="placeholder" class="image-slot">
                <span class="dot el-icon-picture">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" align="center" show-overflow-tooltip></el-table-column>
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
import createTag from '~/components/article/tag/create-tag'

export default {
  name: 'ArticleTag',
  data () {
    return {
      selectedIndex: '',
      hiddenSubTag: [],
      requestApi: '/admin/tag',
      baseApi: '/admin/tag'
    }
  },
  components: {
    createTag
  },
  methods: {
    /**
     * 伸展|收缩子标签
     *
     * @param {int} parentId
     */
    toggleSubTag (parentId) {
      const index = this.hiddenSubTag.findIndex((item) => item === parentId)
      const arr = [...this.hiddenSubTag]
      if (index === -1) {
        arr.push(parentId)
      } else {
        arr.splice(index, 1)
      }

      this.hiddenSubTag = arr
    }
  }
}
</script>

<style lang="scss">
.tag-list {
  list-style: none;
  box-shadow: 0.2rem 0rem 0.7rem 0.5rem #e6e6e6;
  .list-head {
    justify-content: center;
    font-weight: bold;
    border-left: 0;
    border-right: 0;
  }
  li {
    padding: 0.7rem;
    display: grid;
    align-items: center;
    overflow: hidden;
    grid-template-columns: 1fr 2fr 2fr 2fr 1fr;
    border-bottom: 0.1rem solid #e6e6e6;
    border-left: 0.1rem solid #c6c6c6;
    border-right: 0.1rem solid #c6c6c6;
    span {
      &:first-child {
        justify-self: center;
      }
    }
  }
  .show-more-sub-tag {
    grid-column-start: 2;
    grid-column: span 4;
    color: $blue;
  }
  img {
    width: 4.5rem;
  }
  .hid-tag {
    animation: hid-tag 0.5s;
    animation-fill-mode: forwards;
  }
  .indent-2 {
    text-indent: 5em;
  }

  @keyframes hid-tag {
    from {
      height: 6rem;
      border-bottom: 0.1rem solid #e6e6e6;
      border-left: 0.1rem solid #c6c6c6;
      border-right: 0.1rem solid #c6c6c6;
    }
    to {
      height: 0;
      border: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .show-tag {
    animation: show-tag 0.5s;
    animation-fill-mode: forwards;
  }
  @keyframes show-tag {
    from {
      height: 0;
      border: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
    to {
      height: 6rem;
      border-bottom: 0.1rem solid #e6e6e6;
      border-left: 0.1rem solid #c6c6c6;
      border-right: 0.1rem solid #c6c6c6;
    }
  }
  .right-arrow {
    width: 1.2rem;
    color: #666;
    transition: transform 0.5s;
    vertical-align: middle;
  }
  .down-arrow-to-right {
    transform: rotate(-90deg);
  }
  .tag-number {
    align-items: center;
    height: 2rem;
  }
}
</style>
