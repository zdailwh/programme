import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.update_time_range && query.update_time_range.length) {
    params.update_time_range = query.update_time_range
  }
  if (query.userId !== '') {
    params.userId = query.userId
  }
  if (query.roleId !== '') {
    params.roleId = query.roleId
  }
  params.orderby = 'id'
  return request({
    url: '/admin/user/v1/userroles',
    method: 'get',
    params
  })
}

export function createRoleUser(data) {
  return request({
    url: '/admin/user/v1/userroles',
    method: 'post',
    data: data
  })
}

export function deleteRoleUser(query) {
  return request({
    url: '/admin/user/v1/userroles/' + query.id,
    method: 'delete'
  })
}
