import { axios } from '~/plugins/vendor/axios'

// 获取手册详情
export function getManualInfo (id, params) {
  return axios.get('/admin/manual/' + id, { params })
}

// 删除手册
export function deleteManual (id) {
  return axios.delete('/admin/manual/' + id)
}

// 添加目录章节
export function saveCatalog (data) {
  if (data.id) {
    return axios.put('/admin/catalog/' + data.id, data)
  }
  return axios.post('/admin/catalog', data)
}

// 删除目录章节
export function deleteCatalog (id) {
  return axios.delete('/admin/catalog/' + id)
}

// 添加文章
export function saveArticle (data) {
  const { id } = data
  if (id) {
    return axios.put(`/admin/manual/article/${id}`, data)
  }
  return axios.post('/admin/manual/article/', data)
}

// 获取文章详情
export function getArticleDetail (id) {
  return axios.get('/admin/manual/article/' + id)
}
