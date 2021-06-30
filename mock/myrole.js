const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    name: '@first',
    'status|1': [0, 1, 2]
  }))
}

const role = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  name: '@first',
  'status|1': [0, 1, 2]
})

module.exports = [
  {
    url: '/admin/programme/v1/roles',
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
    url: '/admin/programme/v1/roles/[0-9]',
    type: 'put',
    response: config => {
      return role
    }
  },
  {
    url: '/admin/programme/v1/roles',
    type: 'post',
    response: config => {
      return role
    }
  },
  {
    url: '/admin/programme/v1/roles/[0-9]',
    type: 'delete',
    response: config => {
      return role
    }
  }
]

