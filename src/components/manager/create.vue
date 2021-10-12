<template>
  <v-dialog
    width="74rem"
    height="30rem"
    title="添加管理员"
    :visible.sync="dialogVisible"
    @confirm="submit"
  >
    <div class="manager-user-info" v-if="user">
      <avatar :user="user" />
    </div>
    <table class="create-manager">
      <tr>
        <td class="required-feild">邮箱</td>
        <td>
          <v-input v-model="model.email" placeholder="请填写管理员邮箱"></v-input>
        </td>
      </tr>
      <tr>
        <td>角色</td>
        <td>
          <label v-for="(role, index) in roles" :key="index">
            <input type="checkbox" name="role" v-model="model.roles" :value="role.id" /> {{ role.name }}
          </label>
        </td>
      </tr>
    </table>
  </v-dialog>
</template>

<script>
import DialogBox from '~/components/global/dialog-box'
import { getRolesAll, getUserByEmail } from '~/api/user'
export default {
  name: 'CreateManager',
  extends: DialogBox,
  props: {
    originUser: {
      type: [Object, String],
      default () {
        return ''
      }
    },
    create: {
      type: Function,
      default () {
        return () => {}
      }
    }
  },
  data () {
    return {
      model: {
        email: '',
        roles: [],
        id: ''
      },
      roles: [],
      user: this.originUser,
      timer: ''
    }
  },
  watch: {
    'model.email' () {
      if (!this.model.email) {
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        getUserByEmail(this.model.email).then(response => {
          const user = response.data.data
          this.user = user
          this.model.roles = user ? user.roles.map(role => role.id) : ''
          this.model.id = user ? user.id : this.originUser
        })
        this.timer = ''
      }, 700)
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    /**
     * 提交表单
     *
     * @reutrn void
     */
    submit () {
      const model = { ...this.model }

      this.$emit('create', this.$json2FormData(model))
      this.$children[0].close()
    },
    /**
     * 获取所有的角色
     */
    getRoles () {
      getRolesAll().then((response) => (this.roles = response.data.data))
    }
  }
}
</script>

<style lang="scss">
.create-manager {
  box-shadow: unset !important;
  tr {
    &:hover {
      background-color: inherit !important;
    }
    td {
      vertical-align: top;
      &:first-child {
        width: 12rem;
        text-align: right !important;
      }
      border: 0;
      &:last-child {
        text-align: left !important;
      }
    }
  }
  textarea {
    width: 17rem;
    height: 7rem;
    border: 0.1rem solid #c6c6c6;
    padding: 0.5rem;
  }
}
.manager-user-info{
  margin-top: 2rem;
  margin-left: 1rem;
}
</style>
