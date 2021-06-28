const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    ip: '192.168.0.1',
    type: '类型',
    info: '备注',
    'status|1': [0, 1]
  }))
}

const ip = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  ip: '192.168.0.1',
  type: '类型',
  info: '备注',
  'status|1': [0, 1]
})

module.exports = [
  {
    url: '/admin/programme/v1/blackips',
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
    url: '/admin/programme/v1/blackips',
    type: 'post',
    response: config => {
      return ip
    }
  },
  {
    url: '/admin/programme/v1/blackips/[0-9]',
    type: 'delete',
    response: config => {
      return ip
    }
  },
  {
    url: '/admin/programme/v1/blackips/[0-9]/valid',
    type: 'put',
    response: config => {
      return ip
    }
  },
  {
    url: '/admin/programme/v1/blackips/[0-9]/invalid',
    type: 'put',
    response: config => {
      return ip
    }
  },
    {
    url: '/admin/programme/v1/whiteips',
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
    url: '/admin/programme/v1/whiteips',
    type: 'post',
    response: config => {
      return ip
    }
  },
  {
    url: '/admin/programme/v1/whiteips/[0-9]',
    type: 'delete',
    response: config => {
      return ip
    }
  },
  {
    url: '/admin/programme/v1/whiteips/[0-9]/valid',
    type: 'put',
    response: config => {
      return ip
    }
  },
  {
    url: '/admin/programme/v1/whiteips/[0-9]/invalid',
    type: 'put',
    response: config => {
      return ip
    }
  }
]

