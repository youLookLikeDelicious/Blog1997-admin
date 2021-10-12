<template>
  <transition appear @enter="enter" @leave="leave">
    <div v-if="visible" class="create-sensitive-word flex">
      <div class="relative-position inline-block mr-min">
        <v-input theme="box" v-model="model.word" placeholder="敏感词"></v-input>
      </div>
      <v-select v-model="model.category_id" :options="categoryList"></v-select>
      <div class="link-btn-wrapper">
        <v-button type="primary" text icon="icofont-undo" @click="closeDialog">取消</v-button>
        <v-button type="primary" text @click="submit" icon="icofont-upload-alt">提交</v-button>
      </div>
    </div>
  </transition>
</template>

<script>
import createNewModelMixin from '~/mixin/create-new-model'
import compareOriginModel from '~/mixin/compare-origin-model'

export default {
  name: 'CreateSensitiveWord',
  mixins: [compareOriginModel, createNewModelMixin],
  props: {
    categoryList: {
      type: Array,
      default () {
        return []
      }
    },
    originModel: {
      type: Object,
      default () {
        return {
          id: '',
          word: '',
          category_id: 0
        }
      }
    }
  },
  data () {
    return {
      model: {
        ...this.originModel
      }
    }
  },
  computed: {
    allowSubmit () {
      return this.checkModelIsDirty() && this.model.category_id && this.model.word
    }
  }
}
</script>

<style lang="scss">
.create-sensitive-word {
  opacity: 0;
  margin-top: -2rem;
  margin-left: -3rem;
  align-items: center;
  white-space: nowrap;
  .link-btn-wrapper{
    padding-left: 1rem;
  }
  span{
    margin-right: 1rem;
  }
}
</style>
