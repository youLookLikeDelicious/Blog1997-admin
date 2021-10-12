/**
 * 对树形结构的空数组转为 ''
 * @param {Array} data
 * @param {Array} disableIds 禁用的id
 * @return {Array}
 */
function convertChild (data, disableIds) {
  if (!data.child || !data.child.length) {
    data.child = ''
    return
  }

  data.child.forEach(item => {
    if (disableIds.includes(item.parent_id)) {
      disableIds.push(item.id)
    }
    if (disableIds.includes(item.id)) {
      item.disabled = true
    }
    convertChild(item, disableIds)
  })
}

export default function (data, disableIds) {
  if (disableIds && !Array.isArray(disableIds)) {
    disableIds = [disableIds]
  }
  data.forEach(item => {
    convertChild(item, disableIds || [])
  })
}
