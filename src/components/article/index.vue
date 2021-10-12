<template>
  <base-component ref="base" requestApi="/admin/article">
    <template v-slot:tools="{ meta, query, getList }">
      <el-row :span="24" class="article-tab mb-min">
        <v-button type="text" icon="icofont-archive" @click="() => { query.type = ''; getList() }">全部 ({{ meta.total || 0 }})</v-button>
        <v-button type="text" icon="icofont-bucket" @click="() => { query.type = 'draft'; getList() }">草稿箱 ({{ meta.draft || 0 }})</v-button>
        <v-button type="text" icon="icofont-ui-delete" @click="() => { query.type = 'deleted'; getList() }">回收站 ({{ meta.deleted || 0 }})</v-button>
      </el-row>
    </template>
    <template v-slot:search="{ data, query, meta, getList }">
      <el-col :span="4">
        <v-select
          :options="meta.topics"
          placeholder="请选择专题"
          @change="getList"
          v-model="topicId"
        ></v-select>
      </el-col>
      <el-col :span="3" style="text-align: center">
        <div class="order-by">
          <v-button :type="orderBy === 'new' || !orderBy ? 'primary' : 'default'" text @click="query.orderBy = 'new'">最新排序</v-button>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;| </span>
          <v-button :type="orderBy === 'hot' ? 'primary' : 'default'" text @click="query.orderBy = 'hot'">最热排序</v-button>
        </div>
      </el-col>
    </template>
    <el-col :span="2" slot="rightButton" class="right-btn">
      <router-link
        to="/article/create"
        class="icofont-quill-pen create-btn"
        title="写文章"
      ></router-link>
    </el-col>
    <template v-slot:default="{ data, deleteRecord }">
      <ul class="article-list">
        <li
          v-for="(article, index) in data"
          :key="article.id"
          class="mb-min"
        >
          <div class="mb-min">
            <span class="draft-tab" v-if="article.is_draft === 'yes'">草稿</span>
            <v-button v-if="article.is_draft === 'yes' || article.is_draft === undefined">
              <h2>{{ article.title }}</h2>
            </v-button>
            <a v-else target="__blank" :href="article.id">
              <h2>{{ article.title }}</h2>
            </a>
          </div>
          <div class="flex article-list-item-info-wrapper">
            <div class="article-list-item-info">
              <span class="mr-min">{{ article.updated_at | dateFormat }}</span>
              <span class="icofont-eye mr-min"> {{ article.visited }} </span>
              <span class="icofont-google-talk mr-min">
                {{ article.commented }}
              </span>
              <span class="icofont-thumbs-up mr-min">
                {{ article.liked }}
              </span>
            </div>
            <div>
              <v-button type="primary" text @click="createWeChatMaterial(article.id)" icon="icofont-wechat">创建微信素材</v-button>&nbsp;&nbsp;&nbsp;&nbsp;
              <router-link
                v-if="type !== 'deleted'"
                class="icofont-edit link-btn-primary mr-min"
                :to="'/article/create/' + article.id"
              >
               &nbsp;编辑</router-link>
              <v-button v-if="isDeleteList" type="primary" text @click="restoreArticle(article.id)" icon="icofont-refresh">回复</v-button>
              <v-button type="danger" text danger @click="deleteRecord(index, deleted)" icon="icofont-delete">{{ isDeleteList ? '彻底删除' : '删除' }}</v-button>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </base-component>
</template>

<script>
import { createWeChatMaterial, restoreArticle } from '~/api/article'
export default {
  name: 'ArticleList',
  data () {
    return {
      inited: false,
      topicId: '',
      previousTopciId: '',
      orderBy: '', // 排序的方式
      type: '' // 类型
    }
  },
  computed: {
    isDeleteList () {
      return this.type === 'deleted'
    }
  },
  methods: {
    /**
     * 将文章从回收站回复
     *
     * @param {int} id
     */
    restoreArticle (id) {
      restoreArticle(id).then(() => {
        const records = this.$children[0].requestResult.records
        const index = records.findIndex((record) => record.id === id)
        records.splice(index, 1)
      })
        .then(() => {
          this.$refs.base.getList()
        })
    },
    /**
     * 设置文章统计的数量
     *
     * @param {string} type
     */
    setStatisticCount (type) {
      for (const key in type) {
        this.$children[0].requestResult.count[key] += type[key]
      }
    },
    /**
     * 创建微信素材
     *
     * @param {int} id 文章id
     */
    createWeChatMaterial (id) {
      createWeChatMaterial(id)
    }
  }
}
</script>

<style lang="scss">
.article-tab {
  width: 100%;
  color: #666;
  text-align: left;
}
.article-list {
  list-style: none;
  h2 {
    font-weight: bold;
    display: inline;
  }
  li {
    padding: 1rem 0;
    border-bottom: 0.1rem dotted rgb(221, 221, 221);
  }
  .article-list-item-info-wrapper {
    justify-content: space-between;
  }
  .article-list-item-info {
    color: #999;
  }
  .draft-tab {
    padding: 0.3rem 0.5rem;
    border: 0.1rem solid #ddd;
    box-sizing: border-box;
    border-radius: 0.3rem;
    color: #999;
  }
}
.article-list-header {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .topic-wrapper {
    height: 6rem;
    align-items: center;
  }
  .order-by {
    margin-left: 1.5rem;
  }
}
</style>
