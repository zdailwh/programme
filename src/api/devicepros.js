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
  if (query.deviceId !== '') {
    params.deviceId = query.deviceId
  }
  // params.orderby = 'id'
  return request({
    url: '/admin/programme/v1/prodevices',
    method: 'get',
    params
  })
}

export function createProdevice(data) {
  return request({
    url: '/admin/programme/v1/prodevices',
    method: 'post',
    data: data
  })
}

export function updateProdevice(data) {
  return request({
    url: '/admin/programme/v1/prodevices/' + data.id,
    method: 'put',
    data: data
  })
}

export function deleteProdevice(query) {
  return request({
    url: '/admin/programme/v1/prodevices/' + query.id,
    method: 'delete'
  })
}
