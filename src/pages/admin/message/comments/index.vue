<!--
  @Page 待审核评论
  @Auth xy
  @LastEditors xy
  @LastEditTime 2021-9-25
-->
<template>
  <base-component ref="base" requestApi="/admin/comment">
    <template v-slot:tools>
      <div>
        <v-button type="primary" icon="iconfont icon-shenhebutongguo" @click="batchOperate('approve')" :disabled="disableBatchOperation">批量同意</v-button>
        <v-button type="danger" icon="iconfont icon-shenhetongguo" @click="batchOperate('reject')" :disabled="disableBatchOperation">批量回绝</v-button>
      </div>
    </template>
    <template
      v-slot:default="{
        data
      }"
    >
      <el-table ref="table" :data="data" border header-row-class-name="comments-table-header" @selection-change="handleSectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="用户" align="center">
          <template v-slot="{ row }">
            <avatar :user="row.user" style="justify-content: center"/>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content" show-overflow-tooltip align="left">
          <template v-slot="{ row }">
            <div v-html="row.content"></div>
          </template>
        </el-table-column>
        <el-table-column label="评论时间" prop="created_at" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <v-button type="primary" text icon="icofont-edit" @click="approve(row.id)">批 准</v-button>
            <v-button type="danger" text icon="icofont-delete" @click="reject(row.id)">回 绝</v-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </base-component>
</template>

<script>
import { approveComment, rejectComment } from '~/api/article'
export default {
  name: 'VefiryComments',
  data () {
    return {
      selectedIds: []
    }
  },
  computed: {
    disableBatchOperation () {
      return !this.selectedIds.length
    }
  },
  methods: {
    /**
     * 批量审核评论
     *
     * @param {string} operate [approve|reject]
     */
    batchOperate (operate) {
      if (this.disableBatchOperation) {
        return
      }
      /**
       * 批量操作提交的数据
       * @var {json}
       */
      const postData = {
        ids: this.selectedIds
      }

      // reject api需要DELETE方法
      if (operate === 'reject') {
        rejectComment(postData).then(() => {
          this.$refs.base.getList()
        })
      } else {
        approveComment(postData).then(() => {
          this.$refs.base.getList()
        })
      }
    },
    /**
     * 评论通过
     *
     * @param {int} id
     * @return {void}
     */
    approve (id) {
      approveComment({ ids: [id] })
        .then(() => {
          this.$refs.base.getList()
        })
    },
    /**
     * 驳回评论
     *
     * @param {int} id
     * @return {void}
     */
    reject (id) {
      rejectComment({ ids: [id] })
        .then(() => {
          this.$refs.base.getList()
        })
    },
    // 处理多选修改事件
    handleSectionChange (rows) {
      this.selectedIds = rows.map(item => item.id)
    }
  }
}
</script>

<style lang="scss">
.comments-to-verify{
  .comment-content{
    width: 55rem;
    max-width: 55rem;
  }
}
.comments-table-header{
  th {
    text-align: center !important;
  }
}
</style>
