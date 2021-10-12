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
