import { axios } from '~/plugins/vendor/axios'

/**
 * 上传图片
 */
export function uploadImage (data) {
  return axios.post('/admin/upload/image/article', data)
}

// 获取图片的详情
export function getGalleryInfo (id) {
  return axios.get('/admin/gallery/' + id)
}

// 添加备注
export function addRemark (data, id) {
  return axios.put('/admin/gallery/' + id, data)
}

// 获取所有相册
export function getAlbumAll () {
  return axios.get('/admin/gallery/album-all')
}

// 获取所有图片
export function getGalleryAll () {
  return axios.get('/admin/gallery/all')
}
