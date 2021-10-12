<template>
  <!--  新建专题、修改专题-->
  <transition appear @enter="enter" @leave="leave">
    <div v-if="visible" class="create-topic relative-position">
      <div class="display-inline-block">
        <v-input v-model="model.name" placeholder="专题名称"></v-input>
      </div>
      <div class="display-inline-block">
        <span>
          <v-button type="primary" text icon="icofont-undo" @click="closeDialog">取消</v-button>
          <v-button type="primary" text icon="icofont-upload-alt" @click="submit">提交</v-button>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import createNewModelMixin from '~/mixin/create-new-model'
import checkModelIsDirty from '~/mixin/compare-origin-model'

export default {
  name: 'CreateTopic',
  props: {
    originModel: {
      type: Object,
      default () {
        return { name: '' }
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
      return this.checkModelIsDirty() && this.model.name
    }
  },
  mixins: [createNewModelMixin, checkModelIsDirty]
}
</script>

<style lang="scss">
.create-topic {
  display: flex;
  align-items: center;
  opacity: 0;
  margin-left: -3rem;
  margin-top: -2rem;
  box-sizing: border-box;
  span {
    margin-left: 1rem;
    a {
      margin-right: 0.7rem;
      position: relative;
    }
  }
}
</style>
