import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.name !== '') {
    params.name = query.name
  }
  return request({
    url: '/admin/user/v1/permissions',
    method: 'get',
    params
  })
}

export function getAllPermissions() {
  var params = {}
  params.orderby = 'id'
  return request({
    url: '/admin/user/v1/permissions',
    method: 'get',
    params
  })
}

export function createPermission(data) {
  data.menu = data.menu.join(',')
  return request({
    url: '/admin/user/v1/permissions',
    method: 'post',
    data: data
  })
}

export function updatePermission(data) {
  return request({
    url: '/admin/user/v1/permissions/' + data.id,
    method: 'put',
    data: {
      name: data.name,
      type: data.type,
      info: data.info,
      menu: data.menu.join(',')
    }
  })
}

export function deletePermission(query) {
  return request({
    url: '/admin/user/v1/permissions/' + query.id,
    method: 'delete'
  })
}
