import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
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
    url: '/admin/programme/v1/epgs/' + query.id,
    method: 'delete'
  })
}
