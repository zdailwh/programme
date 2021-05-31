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
  return request({
    url: '/admin/programme/v1/devicechns',
    method: 'get',
    params
  })
}

export function createDevicechn(data) {
  return request({
    url: '/admin/programme/v1/devicechns',
    method: 'post',
    data: data
  })
}

export function updateDevicechn(data) {
  return request({
    url: '/admin/programme/v1/devicechns/' + data.id,
    method: 'put',
    data: data
  })
}

export function deleteDevicechn(query) {
  return request({
    url: '/admin/programme/v1/devicechns/' + query.id,
    method: 'delete'
  })
}
