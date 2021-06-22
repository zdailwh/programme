import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.update_time_range && query.update_time_range.length) {
    params.update_time_range = query.update_time_range
  }
  if (query.deviceId !== '') {
    params.deviceId = query.deviceId
  }
  params.orderby = 'id'
  return request({
    url: '/admin/programme/v1/devicechns',
    method: 'get',
    params
  })
}

export function createDevicechn(data) {
  return request({
    url: '/admin/programme/v1/devicechns',
    method: 'post',
    data: data
  })
}

export function updateDevicechn(data) {
  var putdata = {}
  if (data && data.type === 1) {
    putdata.type = data.type
    putdata.cardno = data.cardno
    putdata.portno = data.portno
    putdata.fps = data.fps
    putdata.audiotype = data.audiotype
  }
  if (data && data.type === 0) {
    putdata.type = data.type
    putdata.networkid = data.networkid
    putdata.tsid = data.tsid
    putdata.serviceid = data.serviceid
    putdata.pmtpid = data.pmtpid
    putdata.videopid = data.videopid
    putdata.outurl = data.outurl
    putdata.outport = data.outport
    putdata.bitrate = data.bitrate
    putdata.localaddr = data.localaddr
  }
  return request({
    url: '/admin/programme/v1/devicechns/' + data.id,
    method: 'put',
    data: putdata
  })
}

export function deleteDevicechn(query) {
  return request({
    url: '/admin/programme/v1/devicechns/' + query.id,
    method: 'delete'
  })
}

export function actived(query) {
  return request({
    url: '/admin/programme/v1/devicechns/' + query.id + '/on',
    method: 'put'
  })
}

export function inactived(query) {
  return request({
    url: '/admin/programme/v1/devicechns/' + query.id + '/off',
    method: 'put'
  })
}
