<template>
  <transition appear @enter="enter" @leave="leave">
    <div v-if="visible" class="create-friend-link">
      名称:&nbsp;&nbsp;
      <div class="input-wrapper">
        <v-input placeholder="网站名称" v-model="model.name"></v-input>
      </div>&nbsp;&nbsp;&nbsp;&nbsp;地址:&nbsp;&nbsp;
      <div class="input-wrapper">
        <v-input
            v-model="model.url" placeholder="网站地址"></v-input>
      </div>
      <div>&nbsp;&nbsp;
        <v-button type="primary" text @click="closeDialog">取消</v-button>
        <v-button type="primary" text icon="icofont-upload-alt" @click="submit">提交</v-button>
      </div>
    </div>
  </transition>
</template>

<script>
import createNewModelMixin from '~/mixin/create-new-model'
import createOriginModel from '~/mixin/compare-origin-model'

export default {
  name: 'CreateFriendLink',
  mixins: [createNewModelMixin, createOriginModel],
  props: {
    originModel: {
      type: Object,
      default () {
        return {
          id: '',
          name: '',
          url: ''
        }
      }
    }
  },
  data () {
    return {
      model: { ...this.originModel }
    }
  },
  computed: {
    allowSubmit () {
      return this.checkModelIsDirty() && this.model.name && this.model.url
    }
  }
}
</script>

<style lang="scss">
.create-friend-link {
  opacity: 0;
  width: 100%;
  display: flex;
  margin-top: -2rem;
  margin-left: -3rem;
  white-space: nowrap;
  align-items: flex-end;
  p {
    margin-left: 1.2rem;
    a {
      margin-right: 0.7rem;
      position: relative;
    }
  }
}
</style>
