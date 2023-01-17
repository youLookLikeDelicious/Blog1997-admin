<!--
  @Page 举报信息
  @Auth xy
  @LastEditors xy
  @LastEditTime 2021-9-25
-->
<template>
  <base-component ref="base" request-api="/admin/illegal-info">
    <template v-slot:search="{ query, getList }">
      <el-col :span="4">
        <el-select v-model="query.operate" size="small" style="width: 100%" placeholder="处理结果" clearable @change="getList">
          <el-option label="未处理" value="undo"></el-option>
          <el-option label="已忽略" value="ignore"></el-option>
          <el-option label="已批准" value="approve"></el-option>
        </el-select>
      </el-col>
    </template>
    <template v-slot:default="{ data }">
      <div class="illegal-info-head sub-container">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            class="read-icon-svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <glyph
              glyph-name="readernaut"
              unicode="&#xed61;"
              horiz-adv-x="10"
            />
            <path
              d="M94.1 415.1c20.400000000000006-69.30000000000001 75.5-82.10000000000002 85.30000000000001-83.90000000000003 54.099999999999994-127.5 181.9-217.1 331-217.1 149.30000000000007 0 277.30000000000007 89.9 331.20000000000005 217.79999999999998 1.6000000000000227 0.4000000000000341 3.2999999999999545 0.8000000000000114 5.5 1.5v-171.29999999999998c-19.200000000000045-7.699999999999989-32.700000000000045-26.19999999999999-32.700000000000045-47.89999999999999 0-28.5 23.5-51.7 52.5-51.7s52.5 23.200000000000003 52.5 51.7c0 24.499999999999986-17.299999999999955 44.89999999999999-40.5 50.3v184.89999999999998c16.899999999999977 12.300000000000011 34.700000000000045 32.5 44.5 65.70000000000005 0 0 17.600000000000023 85-11.199999999999932 106.5 0 0-14.100000000000023 19.799999999999955-54.90000000000009 35.10000000000002-3.199999999999932 11.899999999999977-6.899999999999977 23.699999999999932-11.199999999999932 35.09999999999991-15.100000000000023 2.400000000000091-31.600000000000023 5.300000000000068-48.80000000000007 8.800000000000068 25.100000000000023-43.5 39.30000000000007-93.30000000000001 39.30000000000007-146.20000000000005 0-170.2-147.5-308.2-329.40000000000003-308.2-181.89999999999998 0-329.4 138-329.4 308.2 0 54.400000000000034 15.099999999999994 105.39999999999998 41.5 149.70000000000005-15-3.300000000000068-29.400000000000006-6.2000000000000455-43.10000000000002-8.600000000000023-4.899999999999977-12.200000000000045-8.899999999999977-24.700000000000045-12.399999999999977-37.5l-0.6000000000000227-0.20000000000004547c-43.19999999999999-15.399999999999977-57.89999999999999-36.19999999999993-57.89999999999999-36.19999999999993-28.799999999999997-21.400000000000034-11.200000000000003-106.5-11.200000000000003-106.5z m405.9 380c-126.19999999999999-152-437.5-165.70000000000005-437.5-165.70000000000005v116c281.8 1.3000000000000682 437.5 192.10000000000002 437.5 192.10000000000002s155.70000000000005-190.79999999999995 437.5-192.10000000000002v-116s-311.29999999999995 13.700000000000045-437.5 165.70000000000005z m297.70000000000005-287.1c0 36.299999999999955-6.900000000000091 71-19.40000000000009 103-96.09999999999991 21.700000000000045-212.39999999999998 63.299999999999955-278.29999999999995 142.70000000000005-63.19999999999999-76.10000000000002-172.8-117.5-266.4-140-13.100000000000023-32.700000000000045-20.400000000000034-68.40000000000009-20.400000000000034-105.70000000000005 0-159 130.90000000000003-287.9 292.3-287.9 161.29999999999995-2.842170943040401e-14 292.20000000000005 128.89999999999998 292.20000000000005 287.9z m-430.20000000000005-45.60000000000002c0-17.799999999999955-14.699999999999989-32.299999999999955-32.80000000000001-32.299999999999955-18.099999999999966 0-32.80000000000001 14.5-32.80000000000001 32.299999999999955s14.700000000000045 32.30000000000001 32.80000000000001 32.30000000000001c18.100000000000023 0 32.80000000000001-14.5 32.80000000000001-32.30000000000001z m77.80000000000001-81.69999999999999c0-27.5-22.600000000000023-49.69999999999999-50.5-49.69999999999999s-50.5 22.30000000000001-50.5 49.69999999999999c0 27.5 22.599999999999966 49.69999999999999 50.5 49.69999999999999 27.899999999999977 0.10000000000002274 50.5-22.19999999999999 50.5-49.69999999999999z"
            />
          </svg>
        </span>
        <div class="illegal-page-prompt">
          <p>批准:认证举报内容属实,将目标象予以删除</p>
        </div>
      </div>
      <!-------------------------------------------------- 列表部分 ----------------------------------------------->
      <div class="sub-container">
        <el-table :data="data" border>
          <el-table-column label="类型" align="center">
            <template v-slot="{ row }">
              <i
                :class="[
                  row.type === 'article'
                    ? 'icofont-memorial'
                    : 'icofont-speech-comments',
                ]"
              />
              {{ row.type | mailboxType }}
            </template>
          </el-table-column>
          <el-table-column label="举报内容" align="center" show-overflow-tooltip>
            <template v-slot="{ row }">
              <span
                v-if="row.type === 'article'"
                class="text-align-left">
                <a target="_blank" :href="row.content.split(',')[0]">{{
                  row.content.split(',')[0]
                }}</a>
              </span>
              <!-- 如果举报的不是文章，直接显示举报的内容 -->
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span
                v-else
                class="text-align-left"
                v-html="row.notificationable.content"
              />
            </template>
          </el-table-column>
          <el-table-column label="举报原因" align="center">
            <template v-slot="{ row }">
              <span
                class="text-align-left"
                v-html="row.content.split(',')[1]"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="处理结果" align="center">
            <template v-slot="{ row }">
              <el-tag :type="resultTagMap[row.operate]" size="mini">{{ row.operate_name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="{ row }">
              <template v-if="row.operate !== 'undo'">
                  <v-button type="primary" text>-</v-button>
                </template>
              <template v-else>
                <v-button type="primary" text icon="icofont-court-hammer" @click="approveIllegalInfo(row)">同 意</v-button>
                <v-button type="danger" text icon="icofont-focus" @click="ignore(row)">忽 略</v-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </base-component>
</template>

<script>
import { approveInfo, ignoreInfo } from '~/api/illegal-info'
export default {
  name: 'Report',
  data () {
    return {
      requestResult: {},
      readTagMap: { yes: 'success', no: 'warning' },
      resultTagMap: { undo: 'warning', ignore: '', approve: 'success' }
    }
  },
  methods: {
    /**
     * 批准举报的信息
     *
     * @param {Object} row 处理的记录
     */
    approveIllegalInfo (row) {
      // 已经处理，不再做任何其他处理
      if (row.operate !== 'undo') {
        return
      }

      approveInfo(row.id).then(this.$refs.base.getList)
    },
    /**
     * 忽略举报的信息
     * 并将其标记为已读
     *
     *@param {Object} row 处理的记录
     */
    ignore (row) {
      if (row.operate !== 'undo') {
        return
      }
      ignoreInfo(row.id).then(this.$refs.base.getList)
    }
  }
}
</script>

<style lang="scss">
.read-icon-svg {
  width: 3.5rem;
  height: 3.5rem;
}
.illegal-page-prompt {
  display: inline-block;
  margin-top: 1.2rem;
  margin-left: 1.2rem;
  font-size: 1rem;
  color: #999;
  p {
    padding: 0.3rem 0;
  }
}
.illegal-info-head {
  display: flex;
  align-items: center;
  padding-bottom: 0 !important;
}
</style>
