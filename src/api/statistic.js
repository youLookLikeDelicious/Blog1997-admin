import { axios } from '~/plugins/vendor/axios'

/**
 * 仪表盘统计
 */
export function dashboard () {
  return axios.get('/admin/dashboard')
}
