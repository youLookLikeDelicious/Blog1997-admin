/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
var config = (() => {
  return {
    VUE_TITLE: typeof TITLE === 'undefined' ? '' : TITLE,
    VUE_APP_URL: typeof APP_URL === 'undefined' ? '' : APP_URL,
    VUE_API_URL: typeof API_URL === 'undefined' ? '' : API_URL,
    VUE_RSA_PUB_KEY: typeof RSA_PUB_KEY === 'undefined' ? '' : RSA_PUB_KEY,
    VUE_WECHAT_APP_ID: typeof WECHAT_APP_ID === 'undefined' ? '' : WECHAT_APP_ID,
    VUE_GIT_CLIENT_ID: typeof GIT_CLIENT_ID === 'undefined' ? '' : GIT_CLIENT_ID
  }
})()
