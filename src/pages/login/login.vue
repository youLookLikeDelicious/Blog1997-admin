<template>
  <!-- 登陆页面 -->
  <div class="login-background">
    <div class="form-box login-wrap">
      <header>Blog1997</header>
      <table class="auth-table">
        <tr>
          <td>
            <div class="relative-position">
              <i class="icofont-email"></i>
              <div>
                <v-input v-model="model.email" placeholder="邮箱"></v-input>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="relative-position">
              <i class="icofont-lock"></i>
              <div>
                <v-input v-model="model.password" type="password" placeholder="密码"></v-input>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="relative-position">
              <i class="icofont-qr-code"></i>
              <div>
                <v-input v-model="model.captcha" placeholder="验证码"></v-input>
              </div>
              <div class="capcha-wrapper">
                <img
                  :src="`${this.API_URL}/captcha?${captchaRand}`"
                  @click="refreshCaptcha"
                  alt="验证码"
                />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <v-button :class="['auth-btn', { 'auth-btn-disable': !allowSubmit }]">登 陆</v-button>
          </td>
        </tr>
      </table>
      <div class="login-box">
        <a
          v-if="GIT_CLIENT_ID"
          :href="githubUrl"
          class="git"
        />
        <a v-if="WECHAT_APP_ID" :href="wechatUrl" class="wechat" />
        <!-- <a href="javascript:;" class="qq" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { login, loginBySocialCount } from '~/api/user'
import JSEncrypt from 'jsencrypt'
export default {
  layout: 'login',
  name: 'Login',
  data () {
    return {
      model: {
        email: '',
        password: '',
        captcha: ''
      },
      captchaRand: Math.random()
    }
  },
  computed: {
    wechatUrl () {
      const baseUrl = 'https://open.weixin.qq.com/connect/qrconnect?'
      const query = [
        `appid=${this.WECHAT_APP_ID}`,
        `redirect_uri=${this.APP_URL}/admin/login%3ftype=wechat%26redirect=admin`,
        'response_type=code',
        'scope=snsapi_login',
        'state=state'
      ]

      return baseUrl + query.join('&')
    },
    githubUrl () {
      const baseUrl = 'https://github.com/login/oauth/authorize?'
      const query = [
        'client_id=' + this.GIT_CLIENT_ID,
        `redirect_uri=${this.APP_URL}/admin/login%3ftype=github%26redirect=admin`
      ]
      return baseUrl + query.join('&')
    },
    allowSubmit () {
      return this.model.email && this.model.password && this.model.captcha
    }
  },
  beforeMount () {
    document.documentElement.addEventListener('keyup', this.login)
  },
  beforeDestroy () {
    document.documentElement.removeEventListener('keyup', this.login)
  },
  mounted () {
    // 尝试获取email
    this.attemptGetEmail()

    // 获取参数
    const params = window.location.search.match(/(code|type|redirect)=([^&]+)/gi)

    if (!params) {
      return
    }

    loginBySocialCount(params)
      .then(() => {
        window.location.replace('/admin')
      })
  },
  methods: {
    /**
     * 通过账号密码登陆
     */
    login ($e) {
      if ((!this.allowSubmit || $e.keyCode) && $e.keyCode !== 13) {
        return
      }

      const formData = this.getFormData()
      login(formData).then(() => this.toHome())
        .catch(() => {
          this.refreshCaptcha()
        })
    },
    // 获取表单数据
    getFormData () {
      const formData = { ...this.model, remember: 1 }
      if (this.RSA_PUB_KEY) {
        const encryptor = new JSEncrypt()
        encryptor.setPublicKey(this.RSA_PUB_KEY)
        formData.email = encryptor.encrypt(formData.email)
        formData.password = encryptor.encrypt(formData.password)
      }
      return formData
    },
    /**
     * 跳转到管理员页面
     */
    toHome () {
      window.location.replace('/')
    },
    /**
     * 刷新验证码
     */
    refreshCaptcha () {
      this.captchaRand = Math.random()
    },
    /**
     * 尝试获取邮箱
     */
    attemptGetEmail () {
      if (this.$route.query.email) {
        this.model.email = this.$route.query.email
      }
    }
  }
}
</script>

<style lang="scss">
.login-wrap {
  .login-box {
    width: 100%;
    height: 100%;
    text-align: center;
    a {
      width: 3.5rem;
      height: 3.5rem;
      display: inline-block;
    }
  }
}
.capcha-wrapper {
  margin-top: 1rem !important;
  img {
    width: 21rem;
    cursor: pointer;
  }
}
</style>
