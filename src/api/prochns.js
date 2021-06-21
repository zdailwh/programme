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
  if (query.channelId !== '') {
    params.channelId = query.channelId
  }
  return request({
    url: '/admin/programme/v1/prochns',
    method: 'get',
    params
  })
}

export function createProchn(data) {
  return request({
    url: '/admin/programme/v1/prochns',
    method: 'post',
    data: data
  })
}

export function updateProchn(data) {
  return request({
    url: '/admin/programme/v1/prochns/' + data.id,
    method: 'put',
    data: data
  })
}

export function deleteProchn(query) {
  return request({
    url: '/admin/programme/v1/prochns/' + query.id,
    method: 'delete'
  })
}
// 设置应急切播节目
export function emergency(query) {
  return request({
    url: `/admin/programme/v1/prochns/${query.id}/emergency`,
    method: 'put'
  })
}
