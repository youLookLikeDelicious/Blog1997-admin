<template>
  <base-component ref="base" requestApi="/admin/article" :prop-query="params">
    <template v-slot:tools="{ meta, query, getList }">
      <el-row :span="24" class="article-tab mb-min">
        <el-tabs v-model="params.type" @tab-click="getList">
          <el-tab-pane name="">
            <v-button slot="label" text icon="icofont-archive" >全部 ({{ meta.aggregate || 0 }})</v-button>
          </el-tab-pane>
          <el-tab-pane name="draft">
            <v-button slot="label" text icon="icofont-archive" >草稿箱 ({{ meta.draft || 0 }})</v-button>
          </el-tab-pane>
          <el-tab-pane name="deleted">
            <v-button  slot="label" text icon="icofont-archive" >回收站 ({{ meta.deleted || 0 }})</v-button>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </template>
    <template v-slot:search="{ data, query, meta, getList }">
      <el-col :span="4">
        <v-select
          :options="meta.topics"
          placeholder="请选择专题"
          @change="getList"
          v-model="query.topicId"
        ></v-select>
      </el-col>
      <div style="display: content">
        <div class="order-by">
          <v-button :type="orderBy === 'new' || !orderBy ? 'primary' : 'default'" text @click="query.orderBy = 'new'">最新排序</v-button>
          <span style="margin-right: -.7rem"> |</span>
          <v-button :type="orderBy === 'hot' ? 'primary' : 'default'" text @click="query.orderBy = 'hot'">最热排序</v-button>
        </div>
      </div>
    </template>
    <el-col :span="2" slot="rightButton" class="right-btn">
      <router-link
        to="/article/create"
        class="icofont-quill-pen create-btn"
        title="写文章"
      ></router-link>
    </el-col>
    <template v-slot:default="{ data : ArticleList, deleteRecord }">
      <ul class="article-list">
        <li
          v-for="(article) in ArticleList"
          :key="article.id"
          class="mb-min"
        >
          <div class="mb-min">
            <span class="draft-tab" v-if="article.is_draft === 'yes'">草稿</span>
            <v-button v-if="article.is_draft === 'yes' || article.is_draft === undefined" text>
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
              <router-link
              v-if="!isDeleteList"
              class="icofont-edit link-btn-primary mr-min"
              :to="'/article/create/' + article.id"
              >编辑</router-link>
              <v-button type="primary" text @click="createWeChatMaterial(article.id)" icon="icofont-wechat">创建微信素材</v-button>
              <v-button v-if="isDeleteList" type="primary" text @click="restoreArticle(article.id)" icon="icofont-refresh">恢复</v-button>
              <v-button type="danger" text danger @click="deleteRecord(article.id)" icon="icofont-delete">{{ isDeleteList ? '彻底删除' : '删除' }}</v-button>
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
      orderBy: '', // 排序的方式
      // 请求参数
      params: {
        type: ''
      }
    }
  },
  computed: {
    isDeleteList () {
      return this.params.type === 'deleted'
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
