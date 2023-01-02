<template>
  <base-component
    requestApi="/user/profile"
    :show-header="false"
    :force-render-content="true"
    :hiddenPagination="true"
    @updated-data="handleUpdateData"
    ref="base"
  >
    <template v-slot:default>
      <div class="profile">
        <table>
          <tr>
            <td>头像</td>
            <td>
              <div class="flex avatar-setting">
                <avatar :user="{ avatar: user.avatar }" />
                <a class="reset-btn" href="/">
                  修改头像
                  <input
                    type="file"
                    @change="uploadAvatar"
                    accept=".png, .jpg, .jpeg"
                  />
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td>用户名</td>
            <td>
              <div class="inline-block">
                <v-input
                  v-model="userName"
                  name="name"
                  @blur="blurUserName"
                  placeholder="请输入用户名"
                ></v-input>
              </div>
              <v-button type="primary" text icon="icofont-upload-alt" @click="resetName" v-if="userName && userName !== user.name">提 交</v-button>
            </td>
          </tr>
          <tr>
            <td>邮箱</td>
            <td>
              <div class="inline-block">
                <v-input
                  :val="user.email"
                  width="23rem"
                  name="email"
                  @blur="blurUserEmail"
                  v-model="userEmail"
                  autocomplete="off"
                  placeholder="请输入邮箱"
                ></v-input>
              </div>
              <v-button type="primary" text icon="icofont-upload-alt" @click="resetEmail" v-if="userEmail && userEmail !== user.email && emailIsValide">提 交</v-button>
              <span class="error" v-if="!emailIsValide">
                未识别的邮箱格式
              </span>
            </td>
          </tr>
          <tr>
            <td>社交账号</td>
            <td>
              <div class="bind flex">
                <i class="wechat social-account"></i>
                <v-button type="primary" text @click="unbind(1)" v-if="checkBindState(1)">解绑</v-button>
                <v-button v-else type="primary" text :href="wechatHref">绑定</v-button>
              </div>
              <div class="bind flex">
                <i class="git social-account"></i>
                <v-button type="primary" text @click="unbind(2)" v-if="checkBindState(2)">解绑</v-button>
                <v-button v-else type="primary" text :href="githubHref">绑定</v-button>
              </div>
              <!-- <div class="bind flex">
                <i class="qq social-account"></i>
                <v-button type="primary" text @click="unbind(3)" v-if="checkBindState(3)">解绑</v-button>
                <v-button v-else type="primary">绑定</v-button>
              </div> -->
            </td>
          </tr>
          <tr>
            <td>密码</td>
            <td>
              <a
                @click.prevent
                @click="resetPassword"
                class="reset-btn"
                href="/"
                >重 置</a
              >
            </td>
          </tr>
        </table>
      </div>
      <re-bind-account
        v-if="showDialog"
        v-model="showDialog"
        :conflict-info="conflictInfo"
      ></re-bind-account>
    </template>
  </base-component>
</template>

<script>
import ReBindAccount from '~/components/profile/re-bind-account'
import { updateUser, unbind, resetPassword } from '~/api/user'
export default {
  name: 'Profile',
  data () {
    return {
      userName: '',
      userEmail: '',
      conflictInfo: {
        conflictAccount: { name: 'sdf' },
        socialAccount: { name: 'soc' }
      },
      dataList: [],
      showDialog: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    emailIsValide () {
      if (!this.userEmail) {
        return true
      }

      return this.$verify('email', this.userEmail)
    },
    type () {
      return this.$route.params.type
    },
    wechatHref () {
      const baseurl = 'https://open.weixin.qq.com/connect/qrconnect?'
      const query = [
        `appid=${this.WECHAT_APP_ID}`,
        `redirect_uri=${this.APP_URL}/admin/sso/wechat`,
        'response_type=code',
        'scope=snsapi_login',
        'state=state'
      ]
      return baseurl + query.join('&')
    },
    githubHref () {
      const baseUrl = 'https://github.com/login/oauth/authorize?'
      const query = [
        'client_id=' + this.GIT_CLIENT_ID,
        `redirect_uri=${this.APP_URL}/admin/sso/github`
      ]

      return baseUrl + query.join('&')
    }
  },
  components: {
    ReBindAccount
  },
  created () {
    if (!this.userName) {
      this.userName = this.user.name
    }
    if (!this.userEmail) {
      this.userEmail = this.user.email
    }
  },
  methods: {
    /**
     * 上传头像
     *
     * @param {HTMLEvent} event
     * @return {void}
     */
    uploadAvatar (event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      const formData = new FormData()
      formData.append('avatar', file)
      updateUser(this.user.id, formData)
        .then((response) => {
          this.$store.commit('user/setAvatar', response.data.data.avatar)
        })
    },
    /**
     * reset user name
     */
    resetName () {
      updateUser(this.user.id, { name: this.userName })
        .then((response) => {
          this.$store.commit('user/setName', response.data.data.name)
        })
    },
    /**
     * Reset email
     */
    resetEmail () {
      updateUser(this.user.id, { email: this.userEmail })
        .then((response) => {
          this.$store.commit('user/setEmail', response.data.data.email)
        })
    },
    /**
     * 查看是否绑定社交账号
     * @param {int} type
     * @return {boolean}
     */
    checkBindState (type) {
      if (!(this.dataList instanceof Array)) {
        return false
      }
      const finder = (item) => item.type === type
      return this.dataList.find(finder)
    },
    /**
     * @param {int} type
     * @return {void}
     */
    unbind (type) {
      const socialAccount = this.dataList.find(item => item.type === type)
      unbind(socialAccount.id)
        .then(() => {
          this.$refs.base.getList()
        })
    },
    /**
     * 重置密码
     */
    resetPassword () {
      resetPassword({ email: this.user.email })
    },
    /**
     * Handle name input blur event
     */
    blurUserName () {
      if (!this.userName) {
        this.userName = this.user.name
      }
    },
    /**
     * Handle email input blur event
     */
    blurUserEmail () {
      if (!this.userEmail) {
        this.userEmail = this.user.email
      }
    },
    // 获取列表数据
    handleUpdateData ({ data }) {
      this.dataList = data
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">
.profile {
  table {
    width: 97%;
    border-collapse: collapse;
    table-layout: fixed;
    margin: 0 auto;
    overflow: hidden;
    tr {
      td {
        text-align: left;
        padding: 1.5rem 1rem 1.5rem 3rem;
        &:nth-child(1) {
          width: 12rem;
          vertical-align: top;
        }
      }
      &:hover {
        background-color: inherit !important;
      }
    }
  }
  .reset-btn {
    color: $blue;
  }
  .reset-btn {
    position: relative;
    transition: color 0.3s;
    &:hover {
      color: rgb(79, 188, 238);
    }
    &:active {
      color: rgb(8, 128, 184);
    }
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
  .social-account {
    width: 3rem;
    height: 3rem;
    margin: 0.7rem 0 0.7rem 0;
    display: inline-block;
  }
  .bind {
    width: 23rem;
    align-items: center;
    border-bottom: 0.1rem solid #e6e6e6;
    &:last-child {
      border: 0;
    }
  }
  .avatar-setting {
    align-items: center;
    a {
      margin-left: 1.5rem;
    }
  }
}
</style>
