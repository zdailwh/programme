import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit,
    channelId: query.channelId,
    status: query.status
  }

  return request({
    url: '/admin/programme/v1/tempepgs',
    method: 'get',
    params
  })
}

export function createTempEpg(data) {
  return request({
    url: '/admin/programme/v1/tempepgs',
    method: 'post',
    data: data
  })
}

export function updateTempEpg(data) {
  var params = {}
  if (data.epg) {
    params.starttime = data.starttime
    params.epg = data.epg
  }
  return request({
    url: '/admin/programme/v1/tempepgs/' + data.id,
    method: 'put',
    data: params
  })
}

export function pend(query) {
  return request({
    url: '/admin/programme/v1/tempepgs/' + query.id + '/pend',
    method: 'put'
  })
}

export function pass(query) {
  return request({
    url: '/admin/programme/v1/tempepgs/' + query.id + '/pass',
    method: 'put'
  })
}

export function fail(query) {
  return request({
    url: '/admin/programme/v1/tempepgs/' + query.id + '/fail',
    method: 'put'
  })
}

export function upload(query) {
  return request({
    url: '/admin/programme/v1/tempepgs/' + query.id + '/upload',
    method: 'put'
  })
}
