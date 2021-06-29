export const constantRoutes = [
  {
    path: '/channelView',
    component: 'layout/Layout',
    redirect: '/channelView/index',
    meta: { title: '频道预览', icon: 'el-icon-view' },
    children: [
      {
        path: 'index',
        component: 'views/channel-view/index',
        name: 'ChannelViewList',
        meta: { title: '频道预览', icon: 'el-icon-view' }
      }
    ]
  },
  {
    path: '/program',
    component: 'layout/Layout',
    redirect: '/program/index',
    meta: { title: '节目管理', icon: 'el-icon-film' },
    children: [
      {
        path: 'index',
        component: 'views/program/index',
        name: 'ProgramList',
        meta: { title: '节目列表', icon: 'el-icon-files' }
      },
      {
        path: 'add',
        component: 'views/program/add',
        name: 'ProgramAdd',
        meta: { title: '节目上载', icon: 'el-icon-upload' }
      }
    ]
  },
  {
    path: '/proEdit',
    component: 'layout/Layout',
    redirect: '/pro-edit/index',
    meta: { title: '编单', icon: 'el-icon-edit-outline' },
    children: [
      {
        path: 'index',
        component: 'views/pro-edit/index',
        name: 'ProEditMain',
        meta: { title: '编单', icon: 'el-icon-edit-outline' }
      }
    ]
  },
  {
    path: '/examine',
    component: 'layout/Layout',
    redirect: '/examine/index',
    meta: { title: '审核播出', icon: 'el-icon-s-claim' },
    children: [
      {
        path: 'index',
        component: 'views/examine/index',
        name: 'ExamineMain',
        meta: { title: '审核播出', icon: 'el-icon-s-check' }
      }
    ]
  },
  {
    path: '/setting',
    component: 'layout/Layout',
    redirect: '/setting/admin',
    meta: { title: '基本配置', icon: 'el-icon-set-up' },
    children: [
      {
        path: 'admin',
        component: 'views/setting/admin/layout',
        name: 'Admin',
        redirect: '/setting/admin/index',
        children: [
          {
            path: 'index',
            component: 'views/setting/admin/index',
            name: 'AdminList',
            meta: { title: '用户设置', icon: 'peoples' }
          }
        ]
      },
      {
        path: 'pwdSet',
        component: 'views/setting/admin/layout',
        name: 'PwdSet',
        redirect: '/setting/admin/pwdSet',
        children: [
          {
            path: 'index',
            component: 'views/setting/admin/pwdSet',
            name: 'AdminPwdSet',
            meta: { title: '密码强度设置', icon: 'el-icon-lock' }
          }
        ]
      },
      {
        path: 'blackWhite',
        component: 'views/setting/black-white/layout',
        name: 'BlackWhite',
        redirect: '/setting/black-white/index',
        children: [
          {
            path: 'index',
            component: 'views/setting/black-white/index',
            name: 'BlackWhiteList',
            meta: { title: '黑白名单设置', icon: 'el-icon-tickets' }
          }
        ]
      },
      {
        path: 'role',
        component: 'views/setting/role/layout',
        name: 'Role',
        redirect: '/setting/role/index',
        children: [
          {
            path: 'index',
            component: 'views/setting/role/index',
            name: 'RoleList',
            meta: { title: '权限配置', icon: 'el-icon-tickets' }
          }
        ]
      },
      {
        path: 'channel',
        component: 'views/setting/channel/layout',
        name: 'Channel',
        redirect: '/setting/channel/index',
        children: [
          {
            path: 'index',
            component: 'views/setting/channel/index',
            name: 'ChannelList',
            meta: { title: '频道设置', icon: 'el-icon-monitor' }
          }
        ]
      },
      {
        path: 'device',
        component: 'views/setting/device/layout',
        name: 'Device',
        redirect: '/setting/device/index',
        children: [
          {
            path: 'index',
            component: 'views/setting/device/index',
            name: 'DeviceList',
            meta: { title: '设备管理', icon: 'el-icon-cpu' }
          }
        ]
      }
    ]
  },
  {
    path: '/devicechns',
    component: 'layout/Layout',
    redirect: '/devicechns/index',
    children: [
      {
        path: 'index',
        component: 'views/devicechns/index',
        name: 'DeviceChnsList',
        meta: { title: '设备频道管理', icon: 'el-icon-connection' }
      }
    ]
  },
  {
    path: '/devicepros',
    component: 'layout/Layout',
    redirect: '/devicepros/index',
    children: [
      {
        path: 'index',
        component: 'views/devicepros/index',
        name: 'DeviceProsList',
        meta: { title: '设备节目管理', icon: 'el-icon-connection' }
      }
    ]
  },
  {
    path: '/prochns',
    component: 'layout/Layout',
    redirect: '/prochns/index',
    children: [
      {
        path: 'index',
        component: 'views/prochns/index',
        name: 'ProChnsList',
        meta: { title: '频道节目管理', icon: 'el-icon-connection' }
      }
    ]
  },
  {
    path: '/task',
    component: 'layout/Layout',
    redirect: '/task/index',
    meta: { title: '任务管理', icon: 'el-icon-date' },
    children: [
      {
        path: 'index',
        component: 'views/task/index',
        name: 'TaskView',
        meta: { title: '任务总览', icon: 'el-icon-view' }
      },
      {
        path: 'index-jobs',
        component: 'views/task/index-jobs',
        name: 'TaskJobList',
        meta: { title: '主任务', icon: 'el-icon-s-claim' }
      },
      {
        path: 'index-threads',
        component: 'views/task/index-threads',
        name: 'TaskThreadList',
        meta: { title: '主线程', icon: 'el-icon-share' }
      }
    ]
  }
]

export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

