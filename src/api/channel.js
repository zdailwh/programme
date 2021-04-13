import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.name !== '') {
    params.name = query.name
  }
  return request({
    url: '/admin/v1/channels',
    method: 'get',
    params
  })
}

export function actived(query) {
  return request({
    url: '/admin/v1/channels/' + query.id + '/actived',
    method: 'put'
  })
}

export function inactived(query) {
  return request({
    url: '/admin/v1/channels/' + query.id + '/inactived',
    method: 'put'
  })
}

export function createChannel(data) {
  return request({
    url: '/admin/v1/channels',
    method: 'post',
    data: data
  })
}

export function updateChannel(data) {
  return request({
    url: '/admin/v1/channels/' + data.id,
    method: 'put',
    data: {
      name: data.name,
      desc: data.desc,
      v_codec: data.v_codec,
      v_resolution_w: data.v_resolution_w,
      v_resolution_h: data.v_resolution_h
    }
  })
}

export function deleteChannel(query) {
  return request({
    url: '/admin/v1/channels/' + query.id,
    method: 'delete'
  })
}
