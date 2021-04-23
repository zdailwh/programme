import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
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
  return request({
    url: '/admin/programme/v1/tempepgs/' + data.id,
    method: 'put',
    data: {
      epg: data.epg
    }
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
