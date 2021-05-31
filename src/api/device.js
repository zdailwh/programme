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
  if (query.name !== '') {
    params.name = query.name
  }
  return request({
    url: '/admin/programme/v1/devices',
    method: 'get',
    params
  })
}

export function getAllDevices() {
  return request({
    url: '/admin/programme/v1/devices',
    method: 'get'
  })
}

export function createDevice(data) {
  return request({
    url: '/admin/programme/v1/devices',
    method: 'post',
    data: data
  })
}

export function updateDevice(data) {
  return request({
    url: '/admin/programme/v1/devices/' + data.id,
    method: 'put',
    data: data
  })
}

export function deleteDevice(query) {
  return request({
    url: '/admin/programme/v1/devices/' + query.id,
    method: 'delete'
  })
}
