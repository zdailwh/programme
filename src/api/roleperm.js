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
  if (query.permissionId !== '') {
    params.permissionId = query.permissionId
  }
  if (query.roleId !== '') {
    params.roleId = query.roleId
  }
  params.orderby = 'id'
  return request({
    url: '/admin/user/v1/rolepermissions',
    method: 'get',
    params
  })
}

export function createRolePerm(data) {
  return request({
    url: '/admin/user/v1/rolepermissions',
    method: 'post',
    data: data
  })
}

export function deleteRolePerm(query) {
  return request({
    url: '/admin/user/v1/rolepermissions/' + query.id,
    method: 'delete'
  })
}
