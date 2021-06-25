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
  if (query.no !== '') {
    params.no = query.no
  }
  params.orderby = 'id'
  return request({
    url: '/admin/programme/v1/channels',
    method: 'get',
    params
  })
}

export function getAllChannels() {
  var params = {}
  params.orderby = 'id'
  return request({
    url: '/admin/programme/v1/channels',
    method: 'get',
    params
  })
}

export function getChannelsPreview(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit,
    orderby: 'id',
    deviceId: query.deviceId
  }
  return request({
    url: '/admin/programme/v1/channels/preview',
    method: 'get',
    params
  })
}

export function getAllNetworks() {
  return request({
    url: '/admin/programme/v1/channels/getnetworks',
    method: 'get'
  })
}

export function createChannel(data) {
  return request({
    url: '/admin/programme/v1/channels',
    method: 'post',
    data: data
  })
}

export function updateChannel(data) {
  return request({
    url: '/admin/programme/v1/channels/' + data.id,
    method: 'put',
    data: {
      no: data.no,
      width: data.width,
      height: data.height,
      videores: data.videores
    }
  })
}

export function deleteChannel(query) {
  return request({
    url: '/admin/programme/v1/channels/' + query.id,
    method: 'delete'
  })
}
// 修改应急状态为第一种————播出垫片
export function emerempty(data) {
  return request({
    url: `/admin/programme/v1/channels/${data.id}/emerempty`,
    method: 'put'
  })
}
// 修改应急状态为第二种————节目替换
export function emerreplace(data) {
  return request({
    url: `/admin/programme/v1/channels/${data.id}/emerreplace`,
    method: 'put'
  })
}
// 修改应急状态为非应急状态
export function emernone(data) {
  return request({
    url: `/admin/programme/v1/channels/${data.id}/emernone`,
    method: 'put'
  })
}
