<template>
  <!--  新建专题、修改专题-->
  <transition appear @enter="enter" @leave="leave">
    <el-row v-if="visible" class="sensitive-word-inline-form flex relative-position">
      <el-col :span="4" class="mr-min">
        <v-input v-model="model.name" theme="box" placeholder="分类名称"></v-input>
      </el-col>
      <el-col :span="4" class="relative-position inline-block">
        <el-select placeholder="屏蔽级别" v-model="model.rank" size="small" style="width: 100%" clearable>
          <el-option v-for="level in shieldLevel" :key="level.id" :value="level.id" :label="level.name"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="ml-min">
        <v-button type="primary" text icon="icofont-undo" @click="closeDialog">取消</v-button>
        <v-button type="primary" text @click="submit" :disabled="!allowSubmit" icon="icofont-upload-alt">提交</v-button>
      </el-col>
    </el-row>
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
  white-space: nowrap;
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
