
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const authentication = {
  id: 5,
  class: 'app\\user\\admin\\Authentication',
  class_name: '登录认证',
  model_name: '认证',
  create_time: '2021-03-30 08:22:59',
  update_time: '2021-03-30 08:22:59',
  status: 0,
  statusstr: '活跃',
  path: '/api/admin/v1/authentications/5',
  session: '2sjvqmrsip4o99rfbpp641sr01',
  clientip: '111.203.200.208',
  expiretime: '2021-03-30 10:22:59',
  user: {
    id: 1,
    class: 'app\\user\\admin\\User',
    class_name: '系统管理员',
    model_name: '用户',
    create_time: '2021-03-17 14:30:29',
    update_time: '2021-03-17 14:30:29',
    status: 1,
    statusstr: '活跃',
    username: 'system',
    mobile: '13900000000',
    isadmin: 2,
    activity: 0
  },
  permission: [
    {
      class: 'app\\user\\admin\\Permission',
      id: 2,
      type: 1,
      name: '编单',
      service: '',
      version: '',
      action: '',
      serviceclass: '',
      menu: 'ProgramList,Program_,ProEditMain,ProEdit_,AdminEdit,Setting_,AdminUpdatePwd,Setting_',
      info: '编单',
      status: 0,
      delete_id: 0,
      create_time: '2021-07-03 20:58:57',
      update_time: '2021-07-03 21:30:20'
    },
    {
      class: 'app\\user\\admin\\Permission',
      id: 2,
      type: 1,
      name: '编单',
      service: '',
      version: '',
      action: '',
      serviceclass: '',
      menu: 'ChannelViewList,ChannelView_,ProgramList,Program_,AdminEdit,Setting_,AdminUpdatePwd,Setting_',
      info: '编单',
      status: 0,
      delete_id: 0,
      create_time: '2021-07-03 20:58:57',
      update_time: '2021-07-03 21:30:20'
    }
  ]
}

module.exports = [
  // user login
  {
    url: '/admin/v1/authentications',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      return authentication
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/admin/v1/authentications',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
