import { axios } from '~/plugins/vendor/axios'

export function importWord (data) {
  return axios.post('/admin/sensitive-word/import', data)
}
