import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
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
