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
    url: '/admin/programme/v1/roles',
    method: 'get',
    params
  })
}

export function createRole(data) {
  return request({
    url: '/admin/programme/v1/roles',
    method: 'post',
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/admin/programme/v1/roles/' + data.id,
    method: 'put',
    data: {
      name: data.name,
      proms: data.proms
    }
  })
}

export function deleteRole(query) {
  return request({
    url: '/admin/programme/v1/roles/' + query.id,
    method: 'delete'
  })
}
