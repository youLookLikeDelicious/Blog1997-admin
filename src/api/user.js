import { axios } from '~/plugins/vendor/axios'

/**
 * 重置密码
 */
export function updatePassword (data) {
  return axios.post('/admin/password/update', data)
}

/**
 * 通过账号密码登陆
 */
export function login (data) {
  return axios.post('/auth/login', data)
}

/**
 * 通过第三方登陆 微信|github
 */
export function loginBySocialCount (data) {
  return axios.post('/oauth/authorize?' + data.join('&'))
}

/**
 * 获取所有的角色
 */
export function getRolesAll () {
  return axios.get('/admin/manager/create')
}

/**
 * 根据邮箱搜索用户
 */
export function getUserByEmail (email) {
  return axios.get('/admin/manager/user/' + email)
}

// 获取用户详情
export function getUserInfo (id) {
  return axios.get('/admin/user/' + id)
}

/**
 * 更新用户信息
 */
export function updateUser (id, data) {
  return axios.post('/user/update/' + id, data)
}

/**
 * 和第三方账号解除绑定
 */
export function unbind (id) {
  return axios.post('/user/unbind/' + id)
}

/**
 * 请求重置密码
 * 会给注册用户发送一封邮件
 */
export function resetPassword (data) {
  return axios.post('/user/password/reset', data)
}

// 用户冻结
export function freeze (id) {
  return axios.post('/admin/user/freeze/' + id, { _method: 'put' })
}

// 用户解冻
export function unfreeze (id) {
  return axios.put('/admin/user/unfreeze/' + id)
}

// 给用户分配角色
export function assignRole (data) {
  return axios.put(`/admin/manager/${data.id}`, data)
}
