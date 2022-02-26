<!--
  @Page 用户列表
  @Auth xy
  @CreateTime 2020-9-25
  @LastEditors xy
  @LastEditTime 2021-9-25
-->
<template>
  <div>
    <base-component ref="base" :requestApi="requestApi">
      <!-- 搜索部分 -->
      <template v-slot:search="{query, getList}">
        <el-col :span="4">
          <v-input theme="box" v-model="query.name" @change="getList" placeholder="用户名"></v-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.role" popper-class="auth-user-popper" placeholder="角色" @change="getList" clearable style="width: 100%" size="small">
            <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </el-col>
      </template>
      <!-- 列表部分 -->
      <template v-slot="{ data }">
        <el-table :data="data" border>
          <el-table-column label="用户名" prop="name" show-overflow-tooltip align="center">
            <template v-slot="{ row }">
              <div class="user-name-wrapper">
                <el-image :src="row.avatar" :preview-src-list="[row.avatar]" class="avatar" fit="cover">
                  <div slot="placeholder">
                    <span class="el-icon-picture-outline loading-avatar"></span>
                  </div>
                </el-image>
                <div class="info">
                  <p>{{ row.name }}</p>
                  <p class="gender">{{ row.gender }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
          <el-table-column label="注册时间" prop="created_at" align="center"></el-table-column>
          <el-table-column label="角色" prop="name" align="center">
            <template v-slot="{ row }">
              <el-tag v-for="(role, index) in row.roles" :key="index" effect="dark" size="mini">{{ role }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="name" align="center">
            <template v-slot="{ row }">
              <el-tag :type="row.status.code === 1 ? '' : 'danger'" effect="dark" size="mini">{{ row.status.text }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="{ row }">
              <v-button type="primary" @click="handleAssignRole(row.id)" text icon="iconfont icon-fenpei">分配角色</v-button>
              <v-button v-if="row.status.code === 3" type="danger" @click="handleUnfreeze(row.id)" icon="iconfont icon-fengjin1" text>解冻</v-button>
              <v-button v-else type="danger" @click="handleFreeze(row.id)" icon="iconfont icon-fengjin" text>冻结</v-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </base-component>
    <assign-role ref="assignRole" @success="$refs.base.getList()" />
  </div>
</template>

<script>
import { freeze, unfreeze, getRolesAll } from '~/api/user'
import AssignRole from './components/AssignRole.vue'
export default {
  components: { AssignRole },
  data () {
    return {
      requestApi: 'admin/user',
      roleList: []
    }
  },
  created () {
    getRolesAll().then(res => {
      this.roleList = res.data.data
    })
  },
  methods: {
    handleAssignRole (id) {
      this.$refs.assignRole.handleVisible(id)
    },
    // 解冻用户
    handleUnfreeze (id) {
      unfreeze(id).then(() => {
        this.$refs.base.getList()
      })
    },
    // 冻结用户
    handleFreeze (id) {
      freeze(id).then(() => {
        this.$refs.base.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar{
  $size: 4.5rem;
  width: $size;
  height: $size;
  border-radius: $size;
  vertical-align: middle;
}
.loading-avatar{
  font-size: 3rem;
  color: #999;
  vertical-align: middle;
}
.user-name-wrapper{
  display: flex;
  text-align: left;
  vertical-align: middle;
  justify-content: center;
  .info {
    width: 5rem;
    margin-left: .7rem;
    p {
      overflow: hidden;
      white-space: nowrap;
      word-break: keep-all;
      text-overflow: ellipsis;
    }
  }
  .gender{
    color: #999;
    font-size: 1.2rem;
  }
}
</style>
