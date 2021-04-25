const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    name: '冰雪世界3',
    channelname: '测试频道',
    starttime: '2021-04-30 11:30:00.000',
    endtime: '2021-04-30 12:00:00.000',
    duration: '180000',
    'status|1': [0, 1, 2, 3],
    'statusstr|1': ['已保存', '待审核', '审核通过', '审核未通过']
  }))
}

const tempEpg = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  name: '冰雪世界3',
  channelname: '测试频道',
  starttime: '2021-04-30 11:30:00.000',
  endtime: '2021-04-30 12:00:00.000',
  duration: '180000',
  'status|1': [0, 1, 2, 3],
  'statusstr|1': ['已保存', '待审核', '审核通过', '审核未通过']
})

module.exports = [
  {
    url: '/admin/programme/v1/epgs',
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
    url: '/admin/programme/v1/epgs/[0-9]',
    type: 'delete',
    response: config => {
      return tempEpg
    }
  }
]

