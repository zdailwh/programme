const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    name: '节目名称',
    channel: '所属频道',
    filename: '文件名',
    'duration|300-1800': 100, // 秒 5分钟-30分钟
    createdate: '@date',
    size: 12345,
    bitrate: 801846,
    'status|1': [0, 1],
    'statusstr|1': ['有效', '无效']
  }))
}

const program = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  name: '节目名称',
  channel: '所属频道',
  filename: '文件名',
  'duration|300-1800': 100, // 秒 5分钟-30分钟
  createdate: '@date',
  size: 12345,
  bitrate: 801846,
  'status|1': [0, 1],
  'statusstr|1': ['有效', '无效']
})

const task = Mock.mock({
  id: '@increment',
  create_time: '@datetime',
  update_time:'@datetime',
  'status|1': [0, 1, 2, 3, 4, 5],
  'statusstr|1': ['已创建', '文件待上传', '文件上传成功', '处理中', '处理成功', '处理失败'],
  disksn: '12345678',
  localpath: 'C:\\lyl\\test.ts',
  name: '12345678123456781234567812345678',
  ext: 'ts',
  realpath: '/data/web/www/private/uploads/12345678123456781234567812345678/12345678123456781234567812345678.ts',
  mime: '',
  size: 0,
  sizestr: '0B',
  md5: '12345678123456781234567812345678',
  prority: 0,
  retry: 0,
  reviewtime: '@datetime',
  finishtime: '@datetime',
  log: '',
  result: '',
  'filestatus|1': [0, 1, 2],
  'filestatustr|1': ['未知', '正常', '有故障'],
})

module.exports = [
  {
    url: '/admin/programme/v1/programs',
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
    url: '/admin/programme/v1/programs/[0-9]',
    type: 'delete',
    response: config => {
      return program
    }
  },
  {
    url: '/admin/programme/v1/filereviews',
    type: 'post',
    response: config => {
      return task
    }
  },
  {
    url: '/admin/programme/v1/filereviews/[0-9]/merge',
    type: 'put',
    response: config => {
      return task
    }
  }
]

