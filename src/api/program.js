import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.disksn !== '') {
    params.disksn = query.disksn
  }
  if (query.createdate !== '') {
    params.createdate = query.createdate
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
    url: '/admin/programme/v1/programs',
    method: 'get',
    params
  })
}

export function deleteProgram(query) {
  return request({
    url: '/admin/programme/v1/programs/' + query.id + '/delete',
    method: 'get'
  })
}

export function createTask(data) {
  return request({
    url: '/admin/programme/v1/filereviews',
    method: 'post',
    data: data
  })
}

export function mergeTask(query) {
  return request({
    url: `/admin/programme/v1/filereviews/${query.id}/merge`,
    method: 'put'
  })
}
