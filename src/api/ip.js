import request from '@/utils/request'

export function fetchList_black(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.ip !== '') {
    params.ip = query.ip
  }
  if (query.status !== '') {
    params.status = query.status
  }
  params.orderby = 'id'
  return request({
    url: '/admin/programme/v1/blackips',
    method: 'get',
    params
  })
}

export function valid_black(query) {
  return request({
    url: '/admin/programme/v1/blackips/' + query.id + '/valid',
    method: 'put'
  })
}

export function invalid_black(query) {
  return request({
    url: '/admin/programme/v1/blackips/' + query.id + '/invalid',
    method: 'put'
  })
}

export function createIp_black(data) {
  return request({
    url: '/admin/programme/v1/blackips',
    method: 'post',
    data: data
  })
}

export function deleteIp_black(query) {
  return request({
    url: '/admin/programme/v1/blackips/' + query.id,
    method: 'delete'
  })
}

export function fetchList_white(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.ip !== '') {
    params.ip = query.ip
  }
  if (query.status !== '') {
    params.status = query.status
  }
  params.orderby = 'id'
  return request({
    url: '/admin/programme/v1/whiteips',
    method: 'get',
    params
  })
}

export function valid_white(query) {
  return request({
    url: '/admin/programme/v1/whiteips/' + query.id + '/valid',
    method: 'put'
  })
}

export function invalid_white(query) {
  return request({
    url: '/admin/programme/v1/whiteips/' + query.id + '/invalid',
    method: 'put'
  })
}

export function createIp_white(data) {
  return request({
    url: '/admin/programme/v1/whiteips',
    method: 'post',
    data: data
  })
}

export function deleteIp_white(query) {
  return request({
    url: '/admin/programme/v1/whiteips/' + query.id,
    method: 'delete'
  })
}
