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
  return request({
    url: '/admin/programme/v1/channels',
    method: 'get',
    params
  })
}

export function getAllChannels(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  return request({
    url: '/admin/programme/v1/channels',
    method: 'get',
    params
  })
}

export function actived(query) {
  return request({
    url: '/admin/programme/v1/channels/' + query.id + '/on',
    method: 'put'
  })
}

export function inactived(query) {
  return request({
    url: '/admin/programme/v1/channels/' + query.id + '/off',
    method: 'put'
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
    data: data
  })
}

export function deleteChannel(query) {
  return request({
    url: '/admin/programme/v1/channels/' + query.id,
    method: 'delete'
  })
}
