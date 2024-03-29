import request from '@/utils/request'

export function fetchListByDate(query) {
  var params = {}

  if (query.orderby) {
    params.orderby = query.orderby
  }
  if (query.op) {
    params.op = query.op
  }
  if (query.channelId !== '') {
    params.channelId = query.channelId
  }
  if (query.starttime !== '') {
    params.starttime = query.starttime
  }
  if (query.starttime_range && query.starttime_range.length) {
    params.starttime_range = query.starttime_range
  }

  return request({
    url: '/admin/programme/v1/epgs',
    method: 'get',
    params
  })
}

export function getCurrEpg(query) {
  var params = {
    per_page: 1
  }

  if (query.orderby) {
    params.orderby = query.orderby
  }
  if (query.op) {
    params.op = query.op
  }
  if (query.channelId !== '') {
    params.channelId = query.channelId
  }
  if (query.starttime !== '') {
    params.starttime = query.starttime
  }

  return request({
    url: '/admin/programme/v1/epgs',
    method: 'get',
    params
  })
}

export function getLastEpg(query) {
  var params = {
    per_page: 1
  }

  if (query.orderby) {
    params.orderby = query.orderby
  }
  if (query.channelId !== '') {
    params.channelId = query.channelId
  }

  return request({
    url: '/admin/programme/v1/epgs',
    method: 'get',
    params
  })
}

export function deleteEpg(query) {
  return request({
    url: '/admin/programme/v1/epgs/batchdelete',
    method: 'put',
    data: {
      startId: query.id
    }
  })
}

export function epgExport(query) {
  return request({
    url: '/admin/programme/v1/epgs/export?channelId=' + query.channelId,
    method: 'get'
  })
}
