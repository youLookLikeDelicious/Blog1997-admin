
import { axios } from '~/plugins/vendor/axios'

/**
 * 获取所有权限 - 树形结构
 */
export function getAuthAll () {
  return axios.get('/admin/auth')
}

// 获取角色详情
export function getRoleInfo (id) {
  return axios.get('/admin/role/' + id)
}
