<template>
  <div class="create-article flex sub-container">
    <header class="flex">
      <div class="back-to-article-list-btn">
        <router-link to="/article">
          <i class="icofont-rounded-double-left"></i> 文章管理
        </router-link >
      </div>
      <input
        type="text"
        v-model="model.title"
        maxlength="72"
        placeholder="请输入文章标题..."
      />
      <div class="publish-article">
        <v-button type="primary" text icon="icofont-archive" @click="saveAsDraft">保存草稿</v-button>
        <v-button type="primary" text icon="icofont-refresh"
          v-if="!model.content && !articleOriginModel.id"
          @click="changeEditorType"
          :title="model.is_markdown === 'yes' ? '切换为富文本编辑器' : '切换为MarkDown编辑器'">
        </v-button>
        <v-button type="primary" text icon="icofont-upload-alt" @click="handleVisible" >发布</v-button>
      </div>
      <avatar :user="{ avatar: $store.state.user.avatar }" />
    </header>
    <div class="editor-wrapper" v-if="editorVisibility">
      <marked
        v-if="model.is_markdown === 'yes'"
        v-model="model.content"
      />
      <umeditor
        ref="editor"
        v-else
        width="100%"
        height="100%"
        v-model="model.content"
        @receiveUM="receiveUM"
      />
    </div>
    <div class="editor-setting">
      <a href="/" @click.prevent>. . .</a>
      <span class="letter-counter">{{ model.is_markdown === 'yes' ? model.content.length : this.UM ?this.UM.getContentTxt().length : 0}}字</span>
    </div>
    <!-- 发布文章对话框 --begin -->
    <v-dialog
      :visible.sync="dialogVisible"
      title="发布文章"
      width="62rem"
      height="45rem"
      @confirm="submit"
      :disableConfirm="!allowSubmit"
    >
      <table
        class="create-article-table font-size-14"
        @drop.prevent
        @dragover.prevent
      >
        <tr>
          <td><span class="error">*</span> 专题:</td>
          <td>
            <v-select
              v-model="model.topic_id"
              :options="topics"
              :allowCreate="true"
              placeholder="请选择文章专题"
            >
            </v-select>
          </td>
        </tr>
        <tr>
          <td><span class="error">*</span> 标签:</td>
          <td>
            <v-select
              v-model="model.tags"
              :options="tags"
              :maxOptions="5"
              :multiple="true"
              :allowCreate="$role('Master')"
              placeholder="请选择文章标签"
            ></v-select>
          </td>
        </tr>
        <tr>
          <td>原创:</td>
          <td class="is-origin-wrap">
            <v-switch
              v-model="model.is_origin"
              leftValue="yes"
              rightValue="no"
            ></v-switch>
          </td>
        </tr>
        <tr>
          <td>封面:</td>
          <td>
            <upload-image v-model="model.cover"></upload-image>
          </td>
        </tr>
        <tr>
          <td>排序:</td>
          <td>
            <v-input v-model="model.order_by"></v-input>
          </td>
        </tr>
      </table>
    </v-dialog>
  </div>
</template>

<script>
import { uploadImage } from '~/api/upload'
import DialogBox from '~/components/global/dialog-box'
import marked from '~/components/global/marked/marked'
import { saveArticle, getArticleDetail, getCreateArticleData } from '~/api/article'
const defaultArticleModel = {
  id: '',
  tags: [],
  cover: '',
  title: '',
  content: '',
  topic_id: '',
  order_by: 50,
  is_origin: 'yes',
  is_markdown: 'yes'
}
export default {
  extends: DialogBox,
  name: 'CreateArticle',
  layout: 'editor',
  title: '写文章—Blog1997',
  data () {
    return {
      articleOriginModel: '',
      UM: undefined,
      topics: [],
      model: {
        ...defaultArticleModel
      },
      tags: [],
      editorVisibility: false,
      coverSrc: ''
    }
  },
  components: {
    marked
  },
  computed: {
    modelIsFilled () {
      const article = this.model
      return (
        article.content &&
        article.title &&
        article.order_by &&
        article.topic_id &&
        article.tags.length
      )
    },
    allowSubmit () {
      const article = this.model
      let flag = false
      if (article.is_draft === 'yes' && this.modelIsFilled) {
        return true
      }
      // 判定是否修改
      if (
        this.articleOriginModel.id &&
        this.articleOriginModel.is_draft === 'no'
      ) {
        for (const key in article) {
          // 对数组的元素进行比较
          if (article[key] instanceof Array) {
            if (
              !this.$compareArray(article[key], this.articleOriginModel[key])
            ) {
              flag = true
              break
            }
            continue
          }
          // eslint-disable-next-line eqeqeq
          if (article[key] != this.articleOriginModel[key] && article[key]) {
            flag = true
            break
          }
        }

        return flag && this.model.tags.length
      }

      // 判定是否有内容
      return this.modelIsFilled
    },
    routeId () {
      return this.$route.params.id
    }
  },
  created () {
    this.loadData().then(this.createdCallBack)
  },
  watch: {
    routeId () {
      if (!this.routeId) {
        this.model = { ...defaultArticleModel }

        this.model.content = '又是收获满满的一天'

        if (this.topics.length) {
          this.model.topic_id = this.topics[0].id
        }
      }
    }
  },
  methods: {
    /**
     * 提交文章
     */
    submit () {
      if (!this.allowSubmit) {
        return false
      }
      this.uploadArticle()
    },
    /**
     * 上传图片
     */
    uploadImage () {
      // 先提交图片，然后提交整个表单
      const files = this.UM.getFileFormData()
      // 文章中没有图片上传
      if (!files) {
        return Promise.resolve()
      }

      // 上传图片
      const images = new FormData()
      files.forEach((file) => {
        images.append('upfile[]', file)
      })

      return uploadImage(images)
        .then((response) => response.data)
        .then((data) => {
          // 文件上传成功
          this.UM.replaceImageUrl(data.data)
        })
    },
    receiveUM (um) {
      this.UM = um
    },
    /**
     * 保存文章
     */
    async uploadArticle (isDraft = false) {
      // 如果是富文本编辑器，首先上传图片
      if (
        this.model.is_markdown === 'no' ||
        !this.model.is_markdown
      ) {
        await this.uploadImage()
      }

      const formData = this.getFormData(isDraft)

      saveArticle(this.routeId, formData)
        .then((response) => response.data.data)
        .then((article) => {
          if (isDraft) {
            this.initArticle(article)
            return
          }

          // 上传文章成功,返回文章列表
          this.$store.commit('article/setPublishedArticle', article)
          window.setTimeout(() => this.$router.push({ name: 'published' }), 700)
        })
    },
    /**
     * 生成提交的数据
     *
     * @param {boolean} isDraft 是否是草稿
     * @return {json}
     */
    getFormData (isDraft) {
      this.model.is_draft = isDraft ? 'yes' : 'no'

      const formData = this.$json2FormData(this.model)

      if (isDraft && this.model.article_id) {
        formData.append('article_id', this.model.id)
      }

      return formData
    },
    /**
     * 获取文章的内容
     *
     * @param articleId 文章的id
     * @return {Promise}
     */
    getArticle (articleId) {
      // 异步获取数据
      return getArticleDetail(articleId)
        .then((response) => response.data.data)
        .then((article) => {
          // 文章获取成功,初始化文章模型
          this.initArticle(article)
        })
    },
    /**
     * 初始化文章的模型（修改的时候调用）
     *
     * @param {json} article
     */
    initArticle (article) {
      // 草稿可能没有标签
      const tags =
        article.tags && article.tags.length
          ? article.tags.map((tag) => tag.id)
          : []
      // 提取标签的id
      this.model = { ...article, tags: [...tags] }
      this.articleOriginModel = { ...article, tags: [...tags] }
    },
    /**
     * 获取所有专题列表
     *
     * @return {Promise}
     */
    loadData () {
      return getCreateArticleData().then((response) => {
        const data = response.data.data

        this.topics = data.topics
        this.tags = data.tags

        if (!this.routeId && this.topics.length) {
          this.model.topic_id = this.topics[0].id
        }
      })
    },
    /**
     * 保存草稿
     */
    saveAsDraft () {
      if (!this.model.title || !this.model.content) {
        const msg = this.model.title ? '内容不能为空' : '请输入标题'
        this.$setMessage({ msg })
        return
      }
      this.uploadArticle(true)
    },
    /**
     * 切换编辑器的状态
     */
    changeEditorType () {
      this.setEditorVisibility(false)
      this.model.is_markdown =
        this.model.is_markdown === 'yes' ? 'no' : 'yes'
      this.$nextTick(() => {
        this.setEditorVisibility()
      })
    },
    /**
     * 设置富文本编辑器是否显示
     *
     * @param {boolean} visibility
     */
    setEditorVisibility (visibility = true) {
      this.editorVisibility = visibility
    },
    /**
     * 组件 create周期的事件回调
     */
    createdCallBack () {
      // 如果有id参数，获取原文章的内容
      if (this.routeId) {
        this.getArticle(this.routeId)
          .then(() => this.setEditorVisibility())
          .then(this.$lazy)
      } else {
        this.setEditorVisibility()
      }
    }
  }
}
</script>

<style lang="scss">
.create-article {
  padding: 0;
  border-radius: 0;
  overflow: hidden;
  align-items: stretch;
  flex-direction: column;
  height: 100% !important;
  box-sizing: border-box;
  .back-to-article-list-btn {
    font-size: 1.6rem;
    font-weight: bold;
    padding-left: 1rem;
    padding-right: 1rem;
    color: #666;
  }
  input::-webkit-input-placeholder {
    font-size: 1rem;
    letter-spacing: 0.1rem;
  }
  input:-moz-placeholder {
    font-size: 1rem;
    letter-spacing: 0.1rem;
  }
  input:-ms-input-placeholder {
    font-size: 1rem;
    letter-spacing: 0.1rem;
  }
  // 富文本相关样式 --begin
  .editor-wrapper {
    align-self: stretch;
    width: 100%;
    flex: 1 1 100%;
    border-top: 0.1rem solid #d4d4d4;
    margin-top: 0.1rem;
    border-right: .1rem solid #d4d4d4;
    box-sizing: border-box;
    overflow: hidden;
  }
  .edui-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-top: 0;
  }
  .edui-body-container {
    min-height: 0 !important;
    @extend %scroll-bar;
    line-height: 3rem;
  }
  // 富文本相关样式 --end
  .create-article-table {
    white-space: nowrap;
    width: auto;
    margin: 0 auto;
    table-layout: fixed;
    border-collapse: collapse;
    tr {
      td {
        &:first-child {
          padding-right: 1.7rem;
          vertical-align: top;
          width: 3.5rem;
          text-align: right;
        }
      }
    }
    td {
      padding-top: 1.3rem;
      padding-bottom: 1.3rem;
      word-break: keep-all;
    }
  }
  input,
  select,
  select option,
  textarea {
    width: 23rem;
    padding: 0.3rem 0.5rem;
    margin: 0;
    box-sizing: border-box;
  }
  textarea {
    outline: none;
  }
  select,
  textarea {
    border-radius: 0.3rem;
  }
  .hr-wrap {
    width: 23rem;
  }
  .btn-wrap {
    text-align: right;
  }
  .btn {
    @extend %btn;
  }

  .is-origin-wrap {
    label {
      margin-right: 1.2rem;
      &:first-child {
        color: #9cb945;
      }
      &:last-child {
        color: orangered;
      }
    }
    input {
      width: 1.7rem;
    }
  }
  .message {
    color: #666;
    word-break: keep-all;
    display: inline-block;
  }
  .edui-editor-body {
    overflow: auto;
    flex: 1 1 auto;
    display: flex;
    pre {
      line-height: 2.6rem;
      word-break: break-all;
    }
    textarea {
      height: 100% !important;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }
  header {
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    box-sizing: border-box;
    height: 7rem;
    input {
      padding: 2rem 1rem;
      font-size: 2.7rem;
      border: 0;
      flex-grow: 1;
      margin-right: 5rem;
      box-sizing: border-box;
      &::placeholder {
        color: rgb(133, 133, 133);
        font-weight: bolder;
        font-size: 2.7rem;
      }
    }
    .publish-article {
      font-size: 1.6rem;
      margin-right: 1.7rem;
      word-break: keep-all;
      white-space: nowrap;
      flex-wrap: nowrap;
      a {
        &:first-child {
          margin-right: 1.7rem;
        }
      }
    }
  }
  // 页脚信息
  .editor-setting {
    background-color: #666;
    height: 3rem;
    line-height: 3rem;
    font-size: 1.8rem;
    color: #fff;
    font-weight: bolder;
    padding-left: 2rem;
    .letter-counter{
      font-size: 1.3rem;
      font-weight: normal;
      margin-left: 2rem;
    }
  }
  .upload-articke-cover {
    margin-right: 0.7rem;
    input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .article-cover {
    width: 21rem;
    display: block;
    margin-bottom: 2rem;
    border-radius: 0.5rem;
  }
}
</style>
