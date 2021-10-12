<template>
  <base-component :requestApi="requestApi">
    <template v-slot:search="{ query, getList }">
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
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="5">
        <v-select v-model="query.result" :options="statusList" @change="getList" placeholder="状态" clearable></v-select>
      </el-col>
    </template>
    <!-- 列表部分 -->
    <template v-slot:default="{ data }">
      <el-table :data="data" border>
        <el-table-column label="操作" prop="operate" align="center"></el-table-column>
        <el-table-column label="耗时" prop="time_consuming" align="center"></el-table-column>
        <el-table-column label="状态" prop="result" align="center">
          <template v-slot="{ row }">
            <el-tag :type="typeMap[row.result]" effect="dark" size="small">{{ row.resultText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="created_at" align="center"></el-table-column>
        <el-table-column label="备注" prop="message" align="center"></el-table-column>
      </el-table>
    </template>
  </base-component>
</template>

<script>
import { dateRangePickerMixin } from '~/mixin'
const url = '/admin/log/schedule'
export default {
  name: 'ScheduleLog',
  mixins: [dateRangePickerMixin],
  data () {
    return {
      startDate: '',
      endDate: '',
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
  }
}
</script>

<style lang="scss">
</style>
