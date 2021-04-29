const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    name: '@first',
    epg: '[]',
    channel: '',
    operator: '',
    reviewer: '',
    'status|1': [0, 1, 2, 3],
    'statusstr|1': ['已保存', '待审核', '审核通过', '审核未通过']
  }))
}

const tempEpg = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  name: '@first',
  epg: '[]',
  channel: '',
  operator: '',
  reviewer: '',
  'status|1': [0, 1, 2, 3],
  'statusstr|1': ['已保存', '待审核', '审核通过', '审核未通过']
})

module.exports = [
  {
    url: '/admin/programme/v1/tempepgs',
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
    url: '/admin/programme/v1/tempepgs/[0-9]',
    type: 'put',
    response: config => {
      return tempEpg
    }
  },
  {
    url: '/admin/programme/v1/tempepgs',
    type: 'post',
    response: config => {
      return tempEpg
    }
  },
  {
    url: '/admin/programme/v1/tempepgs/[0-9]/pend',
    type: 'put',
    response: config => {
      return tempEpg
    }
  },
  {
    url: '/admin/programme/v1/tempepgs/[0-9]/pass',
    type: 'put',
    response: config => {
      return tempEpg
    }
  },
  {
    url: '/admin/programme/v1/tempepgs/[0-9]/fail',
    type: 'put',
    response: config => {
      return tempEpg
    }
  },
  {
    url: '/admin/programme/v1/tempepgs/[0-9]/upload',
    type: 'put',
    response: config => {
      return tempEpg
    }
  }
]

