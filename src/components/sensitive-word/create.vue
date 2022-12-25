<template>
  <transition appear @enter="enter" @leave="leave">
    <el-row :gutter="10" v-if="visible" class="create-sensitive-word flex">
      <el-col :span="4">
        <v-input theme="box" v-model="model.word" placeholder="敏感词"></v-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="model.category_id" size="small" style="width: 100%">
          <el-option v-for="category in categoryList" :key="category.id" :value="category.id" :label="category.name"></el-option>
        </el-select>
      </el-col>
      <div class="link-btn-wrapper">
        <v-button type="primary" text icon="icofont-undo" @click="closeDialog">取消</v-button>
        <v-button type="primary" text @click="submit" :disabled="!allowSubmit" icon="icofont-upload-alt">提交</v-button>
      </div>
    </el-row>
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
          category_id: ''
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
