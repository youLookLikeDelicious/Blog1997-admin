<template>
  <!--  新建专题、修改专题-->
  <transition
    appear
    @enter="enter"
    @leave="leave"
  >
    <div v-if="visible" class="sensitive-word-inline-form flex relative-position">
      <div class="mr-min">
        <v-input v-model="model.name" theme="box" placeholder="分类名称"></v-input>
      </div>
      <div class="relative-position inline-block">
        <v-select :options="shieldLevel" v-model="model.rank"></v-select>
      </div>
      <span class="ml-min">
        <v-button type="primary" text icon="icofont-undo" @click="closeDialog">取消</v-button>
        <v-button type="primary" text @click="submit" icon="icofont-upload-alt">提交</v-button>
      </span>
    </div>
  </transition>
</template>

<script>
import createNewModelMixin from '~/mixin/create-new-model'
import checkModelIsDirty from '~/mixin/compare-origin-model'

export default {
  name: 'CreateTopic',
  mixins: [createNewModelMixin, checkModelIsDirty],
  props: {
    originModel: {
      type: Object,
      default () {
        return {
          name: '',
          rank: 1
        }
      }
    },
    shieldLevel: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      selfTopicName: this.topicName,
      selfTopicId: this.topicId,
      model: {
        ...this.originModel
      }
    }
  },
  computed: {
    allowSubmit () {
      return this.checkModelIsDirty() && this.model.name && this.model.rank
    }
  }
}
</script>

<style lang="scss">
.sensitive-word-inline-form{
  margin-top: -2rem;
  margin-left: -3rem;
  align-items: center;
  span{
    a{
      margin-right: .7rem;
    }
  }
}
</style>
