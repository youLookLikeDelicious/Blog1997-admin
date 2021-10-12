import { axios } from '~/plugins/vendor/axios'

/**
 * 获取系统配置信息
 */
export function getSystemSetting () {
  return axios.get('/admin/system-setting')
}

/**
 * 更新系统配置
 */
export function updateSystemSetting (id, data) {
  return axios.put('/admin/system-setting/' + id, data)
}

/**
 * 获取邮箱配置
 */
export function getEmailConfig () {
  return axios.get('/admin/email-config')
}

/**
 * 更新邮箱配置
 */
export function updateEmailConfig (id, data) {
  if (id) {
    return axios.put('/admin/email-config/' + id, data)
  }
  return axios.post('/admin/email-config', data)
}

// 获取csrf token
export function getCsrfToken () {
  return axios.get('/csrf')
}
