import { axios } from '~/plugins/vendor/axios'

/**
 * 批准通过的举报内容
 */
export function approveInfo (id) {
  return axios.post('/admin/illegal-info/approve/' + id)
}

/**
 * 忽略举报的内容
 */
export function ignoreInfo (id) {
  return axios.post('/admin/illegal-info/ignore/' + id)
}
