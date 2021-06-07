import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }

  if (query.showname !== '') {
    params.showname = query.showname
  }
  if (query.deviceId !== '') {
    params.deviceId = query.deviceId
  }
  if (query.channelId !== '') {
    params.channelId = query.channelId
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.update_time_range && query.update_time_range.length) {
    params.update_time_range = query.update_time_range
  }
  if (query.finishtime_range && query.finishtime_range.length) {
    params.finishtime_range = query.finishtime_range
  }
  if (query.status !== '') {
    params.status = query.status
  }
  return request({
    url: '/admin/programme/v1/programmes',
    method: 'get',
    params
  })
}

export function getAllPros() {
  return request({
    url: '/admin/programme/v1/programmes',
    method: 'get'
  })
}

export function updateProgram(data) {
  return request({
    url: '/admin/programme/v1/programmes/' + data.id,
    method: 'put',
    data: {
      showname: data.showname
    }
  })
}

export function deleteProgram(query) {
  return request({
    url: '/admin/programme/v1/programmes/' + query.id + '/delete',
    method: 'get'
  })
}

export function createProgram(data) {
  return request({
    url: '/admin/programme/v1/programmes',
    method: 'post',
    data: data
  })
}

export function mergeProgram(query) {
  return request({
    url: `/admin/programme/v1/programmes/${query.id}/merge`,
    method: 'put'
  })
}

export function getAllProdevs(query) {
  return request({
    url: `/admin/programme/v1/programmes/${query.id}/prodevs`,
    method: 'get'
  })
}

export function getAllProchns(query) {
  return request({
    url: `/admin/programme/v1/programmes/${query.id}/prochns`,
    method: 'get'
  })
}
