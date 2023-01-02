<!--
  @Page 消息通知
  @Auth xy
  @LastEditors xy
  @LastEditTime 2021-9-25
-->
<template>
  <base-component ref="base" :requestApi="requestApi">
    <template v-slot:tools="{ meta, query, getList }">
      <div>
        <v-button :type="query.have_read ? 'default' : 'primary'" text @click="() => { query.have_read = ''; getList() }">
          全部 ({{ meta.total || 0 }})
        </v-button>
        <v-button :type="query.have_read === 'yes' ? 'primary' : 'default'" text @click="() => { query.have_read = 'yes'; getList() }">
          已读({{ meta.have_read || 0 }})
        </v-button>
        <v-button :type="query.have_read === 'no' ? 'primary' : 'default'" text @click="() => { query.have_read = 'no'; getList() }">
          未读({{ meta.total ? meta.total - meta.have_read : 0 }})
        </v-button>
      </div>
    </template>
    <!-- 列表部分 -->
    <template v-slot:default="{ data }">
      <div v-if="data.length" class="sub-container">
        <ul
          v-for="(
            { notificationable, user, content, created_at, type }, index
          ) in data"
          :key="index"
          class="notification-list"
        >
          <li class="notification-list-li">
            <div class="notification-header">
              <avatar :user="user" />
              <div class="inline-block">
                <p class="mr-min">
                  <span> {{ content }}</span>
                </p>
                <p>
                  <span>{{ created_at }}</span>
                </p>
              </div>
            </div>
            <div class="notification-subject">
              <!-- 被评论通知 -->
              <div v-if="type === 'App\\Model\\Comment'">
                <!-- <comment
                  :comment="{
                    id: notificationable.id,
                    content: notificationable.content,
                    user: user,
                    created_at: created_at,
                  }"
                /> -->
                <comment-subject :notification-able="notificationable" />
                <v-button
                  v-if="
                    notificationable.replies &&
                    notificationable.replies.current_page <
                    notificationable.replies.last_page
                  "
                  text
                  style="margin-left: 2.2rem"
                  @click="getMoreReply(index)">更多评论>></v-button>
              </div>
              <!-- 被点赞通知 -->
              <div v-else>
                <div v-if="notificationable.able_type === 'App\\Model\\Article'" class="mt-min">
                  <a :href="articleLink(notificationable.thumbable.id)" class="article-title" target="__blank">{{notificationable.thumbable.title}}</a>
                </div>
                <div v-else class="mt-min">
                  <div v-html="notificationable.thumbable.content"></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </base-component>
</template>

<script>
import CommentSubject from '~/components/notification/comment-subject'
// import comment from '~/components/notification/comment'
import { getNotificationComment } from '~/api/article'
const requestApi = '/admin/notification'
export default {
  name: 'Notification',
  data () {
    return {
      requestApi
    }
  },
  components: {
    CommentSubject
    // comment
  },
  methods: {
    /**
     * 剪切文章的内容
     *
     * @param {string} content
     * @return {string}
     */
    pruneContent (content) {
      const moreIndex = content.search(/<!--\s*more\s*-->/)
      if (moreIndex >= 0) {
        return content.slice(0, moreIndex)
      }

      const pureText = content.replaceAll(/<[^>]*>/g, '')
      return `<pre>${pureText.slice(0, 350)}...</pre>`
    },
    /**
     * 获取更多的评论
     *
     * @param {int} index 列表索引
     * @return {void}
     */
    getMoreReply (index) {
      const dataList = this.$refs.base.dataList
      const notification = dataList[index]
      getNotificationComment(notification.id, { page: notification.notificationable.replies.current_page + 1 })
        .then((response) => {
          const replies = notification.notificationable.replies
          this.$refs.base.dataList[index].notificationable.replies = {
            ...response.data.data,
            data: replies.data.concat(response.data.data.data)
          }
        })
    },
    /**
     * 生成article link
     *
     * @param {int} id article id
     */
    articleLink (id) {
      return '/article/' + btoa(id)
    }
  }
}
</script>

<style lang="scss">
.notification-list {
  list-style: none;
  &::before{
    content: '#';
    display: inline;
  }
  .notification-list-li {
    margin: 3rem 0;
    padding-bottom: 5rem;
    border-bottom: 0.1rem solid #c0d6ff;
  }
  .notification-header,
  .notification-header {
    display: flex;
    align-items: center;
    span {
      color: #999;
      font-size: 1.2rem;
    }
  }
  .reply {
    margin-top: 2rem;
    color: #666;
    text-align: right;
  }
  .comment {
    padding-left: 5rem;
  }
}
.editor-wrapper {
  margin: 0 auto;
  .edui-container {
    margin: 0 auto;
  }
  .edui-popup-emotion .edui-tab-content {
    padding: 0 15px !important;
  }
  .btn-wrapper {
    margin-top: 1rem;
    text-align: right;
    padding-right: 4rem;
    a {
      margin-left: 1rem;
    }
  }
}
.notification-subject {
  padding-left: 3rem;
}
</style>
