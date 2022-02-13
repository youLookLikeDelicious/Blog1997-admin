/**
 * @component 分享手册
 */
<template>
  <v-dialog
  @confirm="submit"
  width="64rem"
  height="45rem"
  @close="closeCallback"
  :visible.sync="dialogVisible"
  title="编辑简介">
    <el-form :model="model" label-position="right" label-width="12rem" style="padding-right: 2.1rem">
      <el-row>
        <el-col>

        </el-col>
      </el-row>
    </el-form>
  </v-dialog>
</template>

<script>
import DialogBox from '~/components/global/dialog-box'
export default {
  extends: DialogBox,
  data () {
    return {

    }
  },
  methods: {
    submit () {

    }
  }
}
</script>

<style>

</style>
