import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }

  if (query.id !== '') {
    params.id = query.id
  }
  if (query.thread_id !== '') {
    params.thread_id = query.thread_id
  }
  if (query.target_id !== '') {
    params.target_id = query.target_id
  }
  if (query.jobmethod !== '') {
    params.jobmethod = query.jobmethod
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.update_time_range && query.update_time_range.length) {
    params.update_time_range = query.update_time_range
  }
  if (query.status !== '') {
    params.status = query.status
  }
  return request({
    url: '/admin/task/v1/main_jobs',
    method: 'get',
    params
  })
}

export function jobCancel(query) {
  return request({
    url: `/admin/task/v1/main_jobs/${query.id}/cancel`,
    method: 'get'
  })
}

export function jobImmediate(query) {
  return request({
    url: `/admin/task/v1/main_jobs/${query.id}/immediate`,
    method: 'get'
  })
}
