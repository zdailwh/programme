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
    url: '/admin/user/v1/roles',
    method: 'get',
    params
  })
}

export function getAllRoles() {
  var params = {}
  params.orderby = 'id'
  return request({
    url: '/admin/user/v1/roles',
    method: 'get',
    params
  })
}

export function createRole(data) {
  return request({
    url: '/admin/user/v1/roles',
    method: 'post',
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/admin/user/v1/roles/' + data.id,
    method: 'put',
    data: {
      name: data.name,
      description: data.description
    }
  })
}

export function deleteRole(query) {
  return request({
    url: '/admin/user/v1/roles/' + query.id,
    method: 'delete'
  })
}
