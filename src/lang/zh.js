var dict = {
  default: {
    language: {
      en: '英文',
      ch: '中文'
    },
    system: {
      company: {
        name: '61035部队'
      },
      project: {
        name: '休假登记和审核系统'
      }
    },
    log: {
      title: '日志'
    },
    file: {
      title: '文件'
    }
  },
  application: {
    title: '休假管理',
    new: '我要休假',
    query: '查询和审批',
    detail: '休假申请详情',
    my: '我的休假'
  },
  navbar: {
    dashboard: '统计',
    logOut: '退出登录',
    profile: '个人信息',
    welcome: '首页',
    guide: '帮助',
    errorLog: ''
  },
  register: {
    title: '注册',
    checkemail: '认证邮箱',
    audit: '审核注册'
  },
  login: {
    username: '用户名',
    password: '密码'
  },
  profile: {
    activity: '动态',
    timeline: '时光轴',
    account: '信息'
  },
  comments: {
    title: '社区',
    notice: {
      title: '公告'
    },
    bbs: {
      title: '论坛'
    }
  },
  settings: {
    title: '设置选项',
    fixedHeader: '侧边栏标题',
    tagsView: '标签栏',
    theme: '主题',
    refresh: '刷新',
    close: '关闭',
    closeAll: '关闭全部',
    closeOthers: '关闭其他',
    sidebarLogo: '侧边栏logo'
  }
}
dict.tagsView = dict.settings
dict.route = dict
Object.keys(dict.navbar).forEach((k) => { dict.route[k] = dict.navbar[k] })
export default dict
