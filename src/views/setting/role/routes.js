export const constantRoutes = [
  {
    title: '频道预览',
    name: 'ChannelView',
    children: [
      {
        title: '频道预览',
        name: 'ChannelViewList'
      }
    ]
  },
  {
    title: '节目管理',
    name: 'Program',
    children: [
      {
        title: '节目列表',
        name: 'ProgramList'
      },
      {
        title: '节目上载',
        name: 'ProgramAdd'
      }
    ]
  },
  {
    title: '编单',
    name: 'ProEdit',
    children: [
      {
        title: '编单',
        name: 'ProEditMain'
      }
    ]
  },
  {
    title: '审核播出',
    name: 'Examine',
    children: [
      {
        title: '审核播出',
        name: 'ExamineMain'
      }
    ]
  },
  {
    title: '基本配置',
    name: 'Setting',
    children: [
      {
        title: '编辑个人信息',
        name: 'AdminEdit'
      },
      {
        title: '修改密码',
        name: 'AdminUpdatePwd'
      },
      {
        title: '用户设置',
        name: 'Admin',
        children: [
          {
            title: '用户设置',
            name: 'AdminList'
          }
        ]
      },
      {
        title: '密码强度设置',
        name: 'PwdSet',
        children: [
          {
            title: '密码强度设置',
            name: 'AdminPwdSet'
          }
        ]
      },
      {
        title: '黑白名单设置',
        name: 'BlackWhite',
        children: [
          {
            title: '黑白名单设置',
            name: 'BlackWhiteList'
          }
        ]
      },
      {
        title: '权限配置',
        name: 'Role',
        children: [
          {
            title: '权限配置',
            name: 'RoleList'
          }
        ]
      },
      {
        title: '频道设置',
        name: 'Channel',
        children: [
          {
            title: '频道设置',
            name: 'ChannelList'
          }
        ]
      },
      {
        title: '设备管理',
        name: 'Device',
        children: [
          {
            title: '设备管理',
            name: 'DeviceList'
          }
        ]
      }
    ]
  },
  {
    title: '设备频道管理',
    name: 'DeviceChns',
    children: [
      {
        title: '设备频道管理',
        name: 'DeviceChnsList'
      }
    ]
  },
  {
    title: '设备节目管理',
    name: 'DevicePros',
    children: [
      {
        title: '设备节目管理',
        name: 'DeviceProsList'
      }
    ]
  },
  {
    title: '频道节目管理',
    name: 'ProChns',
    children: [
      {
        title: '频道节目管理',
        name: 'ProChnsList'
      }
    ]
  },
  {
    title: '任务管理',
    name: 'Task',
    children: [
      {
        title: '任务总览',
        name: 'TaskView'
      },
      {
        title: '主任务',
        name: 'TaskJobList'
      },
      {
        title: '主线程',
        name: 'TaskThreadList'
      }
    ]
  }
]

export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

