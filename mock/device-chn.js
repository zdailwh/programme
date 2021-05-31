const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    device: '',
    channel: '',
    type: 0,
    cardno: '码率卡序号',
    portno: '端口号',
    fps: '输出帧率',
    audiotype: '输出声道',
    networkid: '网络ID',
    tsid: '传送流ID',
    serviceid: '业务ID',
    pmtpid: 'PMT PID',
    videopid: 'VIDEO PID',
    outurl: '组播地址',
    outport: '组播端口',
    bitrate: '输出码率',
    localaddr: '输出网卡IP地址',
    'action|1': [0, 1],
    'running|1': [0, 1],
    log: '运行日志',
    'status|1': [0, 1, 2]
  }))
}

const devicechn = Mock.mock({
  id: '@increment',
  device: '',
  channel: '',
  type: 0,
  cardno: '码率卡序号',
  portno: '端口号',
  fps: '输出帧率',
  audiotype: '输出声道',
  networkid: '网络ID',
  tsid: '传送流ID',
  serviceid: '业务ID',
  pmtpid: 'PMT PID',
  videopid: 'VIDEO PID',
  outurl: '组播地址',
  outport: '组播端口',
  bitrate: '输出码率',
  localaddr: '输出网卡IP地址',
  'action|1': [0, 1],
  'running|1': [0, 1],
  log: '运行日志',
  'status|1': [0, 1, 2]
})

module.exports = [
  {
    url: '/admin/programme/v1/devicechns',
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
    url: '/admin/programme/v1/devicechns/[0-9]',
    type: 'put',
    response: config => {
      return devicechn
    }
  },
  {
    url: '/admin/programme/v1/devicechns',
    type: 'post',
    response: config => {
      return devicechn
    }
  },
  {
    url: '/admin/programme/v1/devicechns/[0-9]',
    type: 'delete',
    response: config => {
      return devicechn
    }
  }
]

