/** @page 编辑|新增手册文章 */
<template>
  <div class="create-article flex sub-container">
    <header class="flex">
      <div class="back-to-article-list-btn">
        <router-link :to="`/manual/${$route.params.manual_id}`">
          <i class="icofont-rounded-double-left"></i> 手册
        </router-link >
      </div>
      <input
        type="text"
        v-model="model.title"
        maxlength="72"
        placeholder="标题..."
      />
      <div class="publish-article">
        <v-button type="primary" text icon="icofont-refresh"
          v-if="!model.content && !articleOriginModel.id"
          @click="changeEditorType"
          :title="model.is_markdown === 'yes' ? '切换为富文本编辑器' : '切换为MarkDown编辑器'">
        </v-button>
        <v-button type="primary" text icon="icofont-upload-alt" @click="handleSubmit" >发布</v-button>
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
  </div>
</template>

<script>
import { uploadImage } from '~/api/upload'
import marked from '~/components/global/marked/marked'
import { saveArticle, getArticleDetail } from '~/api/manual'

const defaultArticleModel = {
  id: '',
  title: '',
  content: '',
  manual_id: '',
  catalog_id: '',
  is_markdown: 'yes'
}

export default {
  name: 'CreateArticle',
  layout: 'editor',
  title: '写文章—Blog1997',
  data () {
    return {
      articleOriginModel: '',
      UM: undefined,
      model: {
        ...defaultArticleModel
      },
      editorVisibility: true,
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
        article.title
      )
    },
    allowSubmit () {
      return this.modelIsFilled
    },
    routeId () {
      return this.$route.params.id
    }
  },
  created () {
  },
  watch: {
    '$route.params': {
      handler ({ id: catalogId, manual_id }) {
        this.model.catalog_id = catalogId
        this.model.manual_id = manual_id
        if (catalogId) {
          this.loadArticle(catalogId)
        } else {
          this.model.parent_id = this.$route.query.parent_id
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 提交文章
     */
    handleSubmit () {
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
    async uploadArticle () {
      // 如果是富文本编辑器，首先上传图片
      if (
        this.model.is_markdown === 'no' ||
        !this.model.is_markdown
      ) {
        await this.uploadImage()
      }

      saveArticle(this.model)
        .then(_ => {
          this.$router.push(`/manual/${this.model.manual_id}`)
        })
    },
    /**
     * 初始化文章的模型（修改的时候调用）
     *
     * @param {json} article
     */
    initArticle (article) {
      // 提取标签的id
      this.model = { ...article }
      this.articleOriginModel = { ...article }
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
    // 获取文章详情
    loadArticle (catalogId) {
      getArticleDetail(catalogId).then(response => {
        if (response.data.data) {
          this.model = response.data.data
        }
      })
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
