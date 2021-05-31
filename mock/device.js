const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    ip: '192.168.0.1',
    name: '@first',
    devips: '192.168.0.1',
    mediapath: '/service1/XML/',
    spacetotal: '100',
    spaceavail: '80',
    'status|1': [0, 1, 2]
  }))
}

const device = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  ip: '192.168.0.1',
  name: '@first',
  devips: '192.168.0.1',
  mediapath: '/service1/XML/',
  spacetotal: '100',
  spaceavail: '80',
  'status|1': [0, 1, 2]
})

module.exports = [
  {
    url: '/admin/programme/v1/devices',
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
    url: '/admin/programme/v1/devices/[0-9]',
    type: 'put',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/programme/v1/devices',
    type: 'post',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/programme/v1/devices/[0-9]',
    type: 'delete',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/programme/v1/devices/[0-9]/actived',
    type: 'put',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/programme/v1/devices/[0-9]/inactived',
    type: 'put',
    response: config => {
      return device
    }
  }
]

