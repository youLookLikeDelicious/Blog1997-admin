import { axios } from '~/plugins/vendor/axios'

/**
 * 将文章作为微信公众号的图文素材
 * @param {int} id
 * @returns {Promise}
 */
export function createWeChatMaterial (id) {
  return axios.post('/admin/article/create-wechat-material/' + id)
}

/**
 * 从回收站中恢复文章
 */
export function restoreArticle (id) {
  return axios.post('/admin/article/restore/' + id)
}

/**
 * 新增 评论|留言|回复
 */
export function saveComment (data) {
  return axios.post('/comment', data)
}

/**
 * 删除评论
 */
export function deleteComment (id) {
  return axios.post('/comment/' + id, { _method: 'delete' })
}

/**
 * 获取更多的子标签
 *
 * @param {int} parentId 父标签id
 * @param {int} p 请求的页数
 */
export function getMoreTags (parentId, p) {
  return axios.get(`/admin/tag?parent_id=${parentId}&p=${p}`)
}

// 获取标签详情
export function getTagInfo (id) {
  return axios.get(`/admin/tag/${id}`)
}

/**
 * 新建|保存文章
 */
export function saveArticle (id, data) {
  if (id) {
    data.append('_method', 'put')
    return axios.post('/admin/article/' + id, data)
  }
  return axios.post('/admin/article', data)
}

/**
 * 获取文章详情
 */
export function getArticleDetail (id) {
  return axios.get(`admin/article/${id}`)
}

/**
 * 获取创建文章所需的数据
 */
export function getCreateArticleData () {
  return axios.get('/admin/article/create')
}

/**
 * 评论审核通过
 */
export function approveComment (data) {
  return axios.post('/admin/comment/approve', data)
}

/**
 * 评论审核驳回
 */
export function rejectComment (data) {
  return axios.delete('/admin/comment/reject', data)
}

/**
 * 通知列表获取更多的评论
 */
export function getNotificationComment (id, params) {
  return axios.get('/admin/notification/commentable-comments/' + id, { params: params })
}
