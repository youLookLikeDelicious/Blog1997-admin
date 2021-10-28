<template>
  <!-- 后台页面基础 模板 props: requestApi
    $emits updated-data
  -->
  <div class="base-wrapper relative-position">
    <div v-if="showHeader" class="sub-container mb-3">
      <div class="tool-bar flex">
        <template v-if="$scopedSlots.tools">
          <slot
            name="tools"
            :data="dataList"
            :query="query"
            :meta="meta"
            :getList="getList" />
        </template>
        <el-row class="search-tools flex" :gutter="8">
          <template v-if="$scopedSlots.search" >
            <slot
              name="search"
              :meta="meta"
              :query="query"
              :data="dataList"
              :getList="getList"
              :batchDelete="batchDelete"
            ></slot>
            <el-col :span="5">
              <v-button type="danger" icon="el-icon-circle-close" @click="handleReset">重 置</v-button>
            </el-col>
          </template>
          <template v-if="$scopedSlots.rightButton">
            <slot name="rightButton" :handleShowCreate="handleShowCreate"></slot>
          </template>
          <el-col v-else-if="showCreate" :span="3" class="right-btn">
            <v-button type="primary" icon="icofont-ui-edit" @click="handleShowCreate">添 加</v-button>
          </el-col>
        </el-row>
        <el-row v-if="$scopedSlots.create" style="width: 100%">
          <slot name="create" :create="create" :meta="meta" :data="dataList"></slot>
        </el-row>
      </div>
    </div>
    <div
      v-if="
        (dataList && dataList.length) ||
        forceRenderContent
      "
      class="sub-container"
    >
      <slot
        :edit="edit"
        :meta="meta"
        :create="create"
        :data="dataList"
        :getList="getList"
        :batchDelete="batchDelete"
        :deleteRecord="deleteRecord"
        :handleShowCreate="handleShowCreate"
      />
    </div>
    <div v-else class="sub-container no-data">
      <svg xmlns="http://www.w3.org/2000/svg" height="60" width="60" viewBox="0 0 1000 100" xmlns:xlink="http://www.w3.org/1999/xlink">
        <glyph glyph-name="yacht" unicode="&#xee40;" horiz-adv-x="1000" />
        <path d="M916.4 508.9l21.100000000000023-46.099999999999966h-230.70000000000005l-58.89999999999998-53.19999999999999h-330.9l-90-65.40000000000003-20.400000000000006-4.399999999999977 71.9 69.59999999999997h-71.9s0 29 108.4 25.200000000000045c51.5-4.600000000000023 91 102.5 42.5 96.39999999999998 0 0-171.1-0.6000000000000227-185.8 0.39999999999997726-28 1.8000000000000682-53.099999999999994 53.10000000000002-67.79999999999998 90.20000000000005-1-1-7.5-2-36.30000000000001 1.1999999999999318-7.299999999999997 3.6000000000000227-4.699999999999996 20.300000000000068-4.699999999999996 20.300000000000068-3.5 10.100000000000023 27.6 16.600000000000023 27.6 16.600000000000023h673.4s216.70000000000005-126 152.5-150.80000000000007z m-339.4-29.69999999999999h-45.799999999999955l-82.20000000000005-43.89999999999998h136.39999999999998l-8.399999999999977 43.89999999999998z m24.399999999999977 3.1999999999999886l8.100000000000023-47.299999999999955h17.5l55.700000000000045 47.299999999999955h-81.30000000000007z m153.30000000000007 19.600000000000023l-4.5 0.10000000000002274-30.600000000000023-27.600000000000023h47.299999999999955l-12.199999999999932 27.5z m57.69999999999993-0.5c-13.899999999999977-0.10000000000002274-29 0.10000000000002274-44.89999999999998 0.39999999999997726l11.5-26.69999999999999h45l-11.600000000000023 26.30000000000001z m48.39999999999998 0.6999999999999886c-10.699999999999932-0.30000000000001137-22.699999999999932-0.5-35.59999999999991-0.8000000000000114l11.699999999999932-27.099999999999966h36l-12.100000000000023 27.899999999999977z m12.300000000000068 0.6000000000000227l12.399999999999977-28.400000000000034h33.89999999999998l-14.5 31.600000000000023c-7.899999999999977-1.5-18.799999999999955-2.5-31.799999999999955-3.1999999999999886z"/>
      </svg>暂无记录
    </div>
    <!-- 分页 begin -->
    <div class="sub-container paginate-wrapper mt-4" v-if="!hiddenPagination">
      <el-pagination
        background
        :total="meta.total"
        :current-page="meta.current_page"
        @prev-click="getList"
        @next-click="getList"
        @size-change="(size) => { query.perPage = size; getList() }"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        ></el-pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>

<script>

export default {
  name: 'BaseComponent',
  props: {
    requestApi: {
      type: String,
      default () {
        return ''
      }
    },
    // 是否显示新建按钮
    showCreate: {
      type: Boolean,
      default () {
        return false
      }
    },
    limit: {
      type: Number,
      default () {
        return 20
      }
    },
    showHeader: {
      type: Boolean,
      default () {
        return true
      }
    },
    forceRenderContent: {
      type: Boolean,
      default () {
        return false
      }
    },
    hiddenPagination: {
      type: Boolean,
      default () {
        return false
      }
    },
    propQuery: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      meta: '',
      query: {},
      dataList: [],
      creating: false,
      maxCheckboxNum: 0,
      showCreateNewModel: false, // 控制新建模型 组件的显隐
      currentLimit: this.limit
    }
  },
  watch: {
    requestApi () {
      if (this.requestApi) {
        this.getList()
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    /**
     * 请求列表
     *
     * @param {Boolean} getOrigin 是否获取原始数据
     */
    getList (getOrigin = true) {
      if (!getOrigin && typeof this.$parent.search === 'function') {
        this.$parent.search(this.query)
        return
      }
      const query = { ...this.query, ...this.propQuery }
      for (const key in query) {
        if (!query[key]) {
          delete query[key]
        }
      }
      this.$axios.get(this.requestApi, { params: query }).then((response) => {
        const resData = response.data
        this.dataList = resData.data
        this.meta = resData.meta
        this.$emit('updated-data', { data: resData.data, meta: resData.meta })
      })
    },
    /**
     * 创建新的记录
     *
     * @param {FormDate} model
     * @param {int} id
     * @param {String} url
     * @return {Promise}
     */
    create (model, id, url) {
      if (this.creating) {
        return
      }

      url = (url || this.requestApi) + '/' + id

      this.creating = true
      if (id) {
        if (model instanceof FormData) {
          model.append('_method', 'PUT')
        } else {
          model._method = 'PUT'
        }
      }

      return this.$axios
        .post(url, model)
        .then(() => {
          this.handleHideCreate()
          this.getList()
        })
        .finally(() => {
          this.creating = false
        })
    },
    /**
     * 翻页操作
     * @param {json} query
     */
    changePage (query) {
      if (this.currentLimit !== query.limit) {
        this.currentLimit = query.limit
      }

      this.getList(`p=${query.p}&limit=${query.limit}`)
    },
    /**
     * 编辑元素 (行内编辑)
     * @param int index
     */
    edit (index) {
      this.$set(this.dataList[index], 'editAble', !this.dataList[index].editAble)
      // this.dataList[index].editAble = !this.dataList[index].editAble
    },
    /**
     * 删除相关记录
     *
     * @param {int} id
     */
    deleteRecord (id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .post(`${this.getBaseUrl()}/${id}`, { _method: 'DELETE' })
          .then(() => {
            this.getList()
          })
      })
    },
    /**
     * 批量删除
     * @param json params 额外的参数
     * @returns {void}
     */
    batchDelete (params = {}) {
    },
    /**
     * 显示 新建
     */
    handleShowCreate (id) {
      this.$parent.$refs.create.handleVisible(id)
    },
    /**
     * 隐藏新建
     */
    handleHideCreate () {
      this.$parent.$refs.create.closeDialog()
    },
    /**
     * 返回baseURL
     *
     * @return {string}
     */
    getBaseUrl () {
      const questionMarkPosition = this.requestApi.indexOf('?')
      return questionMarkPosition >= 0
        ? this.requestApi.slice(0, this.requestApi.indexOf('?'))
        : this.requestApi
    },
    // 翻页
    handleCurrentChange (page) {
      this.query.page = page
      this.getList()
    },
    // 重置搜索条件
    handleReset () {
      const values = Object.values(this.query)
      for (let i = 0, len = values.length; i < len; i++) {
        if (values[i]) {
          this.query = {}
          this.getList(false)
          return
        }
      }
    }
  }
}
</script>

<style lang="scss">
.base-wrapper {
  width: 100%;
  font-size: 1.5rem;
  box-sizing: border-box;
  .data-list {
    tr {
      transition: background-color .3s;
      &:hover {
        background-color: #e6f6fd;
      }
      &:first-child {
        th {
          padding: 2rem 0;
        }

        background-color: #f5f7fa;
      }
    }
    td {
      min-height: 5.3rem;
      height: 5.3rem;
      box-sizing: border-box;
    }
  }
  .create-btn {
    color: $blue;
    transition: all 0.2s;
    font-size: 5rem;
    &:hover {
      color: #9ebcd4;
    }
    &:active {
      color: #1b84da;
    }
  }
  .search-tools {
    width: 100%;
    align-items: center;
    .el-row{
      width: 100%;
    }
    .right-btn{
      margin-left: auto;
      text-align: right;
    }
  }
  .no-data{
    color: #999;
    text-align: center;
    svg{
      fill: #999;;
    }
  }
}
.editable-wrapper {
  position: relative;
  width: 100%;
  white-space: nowrap;
  height: 3rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin: 0 auto;
  justify-content: center;
  a {
    position: absolute;
  }
}
.create-new-model-container {
  flex: 1 1 21rem;
  align-items: center;
  min-height: 4rem;
}
.tool-bar {
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .btn-enable {
    word-break: keep-all;
    white-space: nowrap;
  }
}
.paginate-wrapper{
  text-align: right;
}
</style>
