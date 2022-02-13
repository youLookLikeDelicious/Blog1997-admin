<template>
  <v-dialog
    width="45rem"
    height="25rem"
    :title="title"
    @confirm="submit"
    @close="closeCallback"
    :visible.sync="dialogVisible">
    <el-form ref="form" :model="model" :rules="rules" label-position="right" label-width="10rem">
      <el-row style="padding-left: 3.5rem">
        <el-col>
          <el-form-item label="父级目录" prop="parent_id">
            <el-cascader
              ref="cascader"
              clearable
              size="mini"
              :options="catalogs"
              @change="$hideCascader($refs.cascader)"
              v-model="model.parent_id"
              :style="{ width: '23rem' }"
              :props="{ expandTrigger: 'hover', emitPath: false, label: 'name', value: 'id', checkStrictly: true, label: 'name' }"
              placeholder="父级章节"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="label" prop="name">
            <v-input v-model="model.name" :placeholder="label"></v-input>
          </el-form-item>
        </el-col>
        <!-- <el-col>
          <el-form-item label="是否公开" prop="is_public">
            <v-switch v-model="model.is_public" :leftValue="1" :rightValue="2"></v-switch>
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import { saveCatalog } from '~/api/manual'
import DialogBox from '~/components/global/dialog-box'

export default {
  extends: DialogBox,
  props: {
    catalogs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      model: {
        type: 1,
        name: '',
        is_public: 1,
        parent_id: 0,
        manual_id: this.$route.params.id
      },
      rules: {
        name: { required: true, message: '请输入章节名称', trigger: 'change' }
      }
    }
  },
  computed: {
    title () {
      return this.model.type === 1
        ? this.model.id ? '编辑章节' : '添加章节'
        : this.model.id ? '编辑文章' : '添加文章'
    },
    label () {
      return { 1: '章节名称', 2: '标题' }[this.model.type]
    }
  },
  methods: {
    // eslint-disable-next-line camelcase
    handleVisible (id, type = 1) {
      this.id = id
      if (this.model.type !== type) {
        this.model.type = type
      }
      this.dialogVisible = true
    },
    // 提交表单
    submit () {
      this.$refs.form.validate()
        .then(_ => {
          return saveCatalog(this.model)
        })
        .then(_ => {
          this.closeDialog()
          this.$emit('success')
        })
    }
  }
}
</script>

<style>

</style>
