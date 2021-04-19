const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    username: '@first',
    mobile: '18601234567',
    password: '',
    'isadmin|1': [0, 1, 2],
    activity: '@increment',
    'status|1': [0, 1, 2]
  }))
}

const user = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  username: '@first',
  mobile: '18601234567',
  password: '',
  'isadmin|1': [0, 1, 2],
  activity: '@increment',
  'status|1': [0, 1, 2]
})

module.exports = [
  {
    url: '/admin/v1/users',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 0, per_page = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < per_page * (page + 1) && index >= per_page * page)

      return {
        total: mockList.length,
        items: pageList
      }
    }
  },
  {
    url: '/admin/v1/users/[0-9]',
    type: 'put',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users',
    type: 'post',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/[0-9]',
    type: 'delete',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/[0-9]/actived',
    type: 'put',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/[0-9]/inactived',
    type: 'put',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/changepassword',
    type: 'put',
    response: config => {
      return user
    }
  },
  {
    url: '/admin/v1/users/[0-9]/resetpassword',
    type: 'put',
    response: config => {
      return user
    }
  }
]

