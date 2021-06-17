import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }

  return request({
    url: '/admin/task/v1/main_threads',
    method: 'get',
    params
  })
}

export function getLast() {
  return request({
    url: '/admin/task/v1/main_threads/last',
    method: 'get'
  })
}

export function threadStop(query) {
  return request({
    url: `/admin/task/v1/main_threads/stop`,
    method: 'get'
  })
}

export function threadRestart(query) {
  return request({
    url: `/admin/task/v1/main_threads/restart`,
    method: 'get'
  })
}
