<template>
  <div>
    <base-component ref="base" requestApi="/admin/manual" showCreate>
      <!-- 搜索部分 -->
      <template v-slot:search="{ query, getList }">
        <v-input theme="box" v-model="query.name" @change="getList" placeholder="名称"></v-input>
      </template>
      <template v-slot:create="{ create }">
        <create-manual ref="create" @create="create" />
      </template>
      <template v-slot:default="{ data: manualList }">
        <div class="manual-list-wrapper">
          <div class="manual-list-box" v-for="(manual, index) in manualList" :key="manual.id">
            <el-dropdown @command="(command) => handleCommand(command, manual.id)">
              <i class="iconfont icon-2601caidan2"></i>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <router-link
              :to="`manual/${manual.id}`"
              :title="manual.name">
              <el-image :src="manual.cover" fit="cover">
                <div slot="placeholder" class="image-slot" :style="{ background: background[index % 6] }">
                  <i class="icofont-book-alt"></i>
                </div>
                <div slot="error" class="image-slot">
                  <i class="icofont-book-alt"></i>
                </div>
              </el-image>
              <div class="title-wrapper">
                <h2>{{ manual.name }}</h2>
                <p>{{ manual.updated_at }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </template>
    </base-component>
  </div>
</template>

<script>
import CreateManual from './components/create-manual'
export default {
  components: { CreateManual },
  data () {
    return {
      background: [
        'linear-gradient(#a1c4fd, #c2e9fb)',
        'linear-gradient(#667eea, #764ba2)',
        'linear-gradient(#667eea, #764ba2)',
        'linear-gradient(#89f7fe, #66a6ff)',
        'linear-gradient(#ff758c, #ff7eb3)',
        'linear-gradient(#B7F8DB, #50A7C2)'
      ]
    }
  },
  methods: {
    handleCommand (command, id) {
      switch (command) {
        case 'edit':
          this.$refs.base.handleShowCreate(id)
          break
        case 'delete':
          break
      }
    }
  }
}
</script>

<style lang="scss">
.manual-list-wrapper{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 3%;
  row-gap: 1.6rem;
  .manual-list-box{
    width: 100%;
    height: 35rem;
    position: relative;
    overflow: hidden;
    &:hover {
      .el-image {
        width: 110%;
        height: 110%;
        margin-top: -5%;
        margin-left: -5%;
      }
      .title-wrapper{
        p{
          margin-bottom: 1.2rem;
        }
      }
      .el-dropdown{
        visibility: visible;
        right: 1.2rem;
      }
    }
    .el-dropdown{
      z-index: 9;
      top: 1.2rem;
      right: 0rem;
      visibility: hidden;
      position: absolute;
      transition: right .3s cubic-bezier(0, .5, 0.3, 1.5);
      .iconfont {
        color: $white;
        font-size: 2.3rem;
        text-shadow: .1rem .1rem 3rem #eee;
      }
    }
    .el-image {
      width: 100%;
      height: 100%;
      transition: width .3s, margin .3s, height .3s;
      .image-slot{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .icofont-book-alt{
          color: #f5f7fa;
          font-size: 9.5rem;
        }
      }
    }
    .title-wrapper{
      left: 0;;
      bottom: 0;
      width: 100%;
      padding: 1.2rem;
      position: absolute;
      // background-color: rgba(#333, .3);
      h2 {
        color: #f5f7fa;
        font-size: 1.6rem;
        transition: margin .3s cubic-bezier(0, .5, 0.3, 2.5);
        // text-shadow: .1rem .1rem 3rem #fff;
      }
      p {
        color: #f5f7fa;
        transition: margin .3s cubic-bezier(0, .5, 0.3, 2.5);
        // text-shadow: .1rem .1rem 3rem #fff;
      }
    }
    &:last-child {
      margin-right: auto;
    }
  }
}
</style>
