import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.username !== '') {
    params.username = query.username
  }
  return request({
    url: '/admin/v1/users',
    method: 'get',
    params
  })
}

export function actived(query) {
  return request({
    url: '/admin/v1/users/' + query.id + '/actived',
    method: 'put'
  })
}

export function inactived(query) {
  return request({
    url: '/admin/v1/users/' + query.id + '/inactived',
    method: 'put'
  })
}

export function createUser(data) {
  return request({
    url: '/admin/v1/users',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/admin/v1/users/' + data.id,
    method: 'put',
    data: {
      username: data.username,
      mobile: data.mobile
    }
  })
}

export function deleteUser(query) {
  return request({
    url: '/admin/v1/users/' + query.id,
    method: 'delete'
  })
}

export function updatePwd(data) {
  return request({
    url: '/admin/v1/users/changepassword',
    method: 'put',
    data: {
      old: data.old,
      new: data.new
    }
  })
}

export function resetPwd(data) {
  return request({
    url: '/admin/v1/users/' + data.id + '/resetpassword',
    method: 'put',
    data: {
      password: data.password
    }
  })
}
