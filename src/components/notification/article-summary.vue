<template>
  <div class="article-box">
    <template v-if="article">
      <a class="article-title inline-block" :href="'/article/' + article.id" target="_blank">{{
        article.title
      }}</a>
      <avatar :user="article.user" />
      <article class="article-summary" v-html="article.summary">
      </article>
    </template>
    <template v-else>
      <span class="no-data">文章已被删除</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ArticleSummary',
  props: {
    article: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss">
.article-summary {
  line-height: 2rem;
  margin-top: 0.7rem;
  padding: 1rem 2rem;
  border-radius: 0.3rem;
  background-color: #f5f7fa;
}
.article-title {
  font-size: 2.7rem;
  font-weight: bolder;
  background-image: linear-gradient(to bottom right, #276ace, #29bdd9);
  background-clip: text;
  color: transparent !important;
  margin: .7rem 0;
}
</style>
