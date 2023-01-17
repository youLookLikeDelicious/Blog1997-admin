<template>
  <div class="comment-subject">
    <article-summary
      v-if="notificationAble.able_type === 'article'"
      :article="notificationAble.commentable"
    />
    <comment v-else-if="notificationAble.commentable" :comment="notificationAble.commentable" />
    <div v-else-if="!notificationAble.id" class="other-content">
      <div v-html="notificationAble.content"></div>
    </div>
    <!-- comment list -->
    <comment :comment="comments"></comment>
  </div>
</template>

<script>
import ArticleSummary from './article-summary'
import Comment from './comment'
export default {
  name: 'CommentSubject',
  props: {
    notificationAble: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  components: {
    Comment,
    ArticleSummary
  },
  computed: {
    comments () {
      if (!this.notificationAble.replies) {
        return []
      }

      return [...this.notificationAble.replies.data]
    }
  }
}
</script>

<style lang="scss">
.comment-subject {
  .comment-box {
    .comment{
        padding-bottom: .5rem;
        border-bottom: 0.1rem solid #e6e6e6;
        margin-bottom: 1rem;
    }
  }
  .article-box,
  .comment-box {
    border-radius: 0.5rem;
    padding: 1rem 2rem;
    box-sizing: border-box;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
  }
  .article-box {
    .article-title {
      margin-bottom: 1.2rem;
    }
  }
  .other-content {
    color: #666;
    margin-top: 1.2rem;
    margin-left: 2.1rem;
    display: flex;
    >span {
      color: #999;
      margin-right: 1.2rem;
    }
  }
}
</style>
