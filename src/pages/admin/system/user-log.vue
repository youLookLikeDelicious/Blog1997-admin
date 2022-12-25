<template>
  <base-component :requestApi="requestApi">
    <!-- 搜索部分 -->
    <template v-slot:search="{query, getList}">
      <el-col :span="6">
        <el-date-picker
          v-model="query.date"
          type="daterange"
          align="right"
          size="small"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd"
          @change="getList"
          style="width: 100%"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <v-select v-model="query.result" :options="statusList" @change="getList" placeholder="状态" clearable></v-select>
      </el-col>
    </template>
    <!-- 列表部分 -->
    <template v-slot:default="{ data }">
      <el-table :data="data" border class="user-log">
        <el-table-column label="用户名" align="center">
          <template v-slot="{ row }">
            <avatar :user="row.user" />
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" align="center"></el-table-column>
        <el-table-column label="IP" prop="ip" align="center"></el-table-column>
        <el-table-column label="状态" prop="result" align="center">
          <template v-slot="{ row }">
            <el-tag :type="typeMap[row.result]" effect="dark" size="small">{{ row.resultText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="耗时(ms)" prop="time_consuming" align="center"></el-table-column>
        <el-table-column label="位置" prop="location" align="center"></el-table-column>
        <el-table-column label="时间" prop="created_at" align="center"></el-table-column>
        <el-table-column label="备注" prop="message" align="center"></el-table-column>
      </el-table>
    </template>
  </base-component>
</template>

<script>
import { dateRangePickerMixin } from '~/mixin'
const url = '/admin/log'
export default {
  name: 'UserLog',
  mixins: [dateRangePickerMixin],
  data () {
    return {
      startDate: '',
      endDate: '',
      email: '',
      requestApi: url,
      typeMap: {
        success: 'success',
        failure: 'danger'
      },
      statusList: [
        {
          id: 'success',
          name: '成功'
        },
        {
          id: 'failure',
          name: '失败'
        },
        {
          id: 'neutral',
          name: '正常'
        }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.user-log {
  .user-info {
    padding: 0;
    justify-content: center;
  }
}
</style>
