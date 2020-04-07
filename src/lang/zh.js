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
      },
      title: '高级'
    },
    app: {
      title: '应用',
      log: {
        title: '日志'
      },
      file: {
        title: '文件'
      }
    },
    utils: {
      title: '工具',
      qrCode: {
        title: '二维码',
        Create: {
          title: '生成'
        },
        Scan: {
          title: '扫描'
        }
      }
    }
  },
  application: {
    title: '休假管理',
    new: '我要休假',
    query: '查询申请',
    audit: '审批申请',
    detail: '休假申请详情',
    auditStream: '审批流设置',
    my: '我的休假'
  },
  navbar: {
    dashboard: '统计',
    logOut: '退出登录',
    profile: '个人信息',
    welcome: '首页',
    guide: '帮助'
  },
  register: {
    title: '注册',
    new: '注册新号',
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
  },
  errorLog: {
    title: '错误日志'
  }
}
dict.tagsView = dict.settings
dict.route = dict
Object.keys(dict.navbar).forEach((k) => { dict.route[k] = dict.navbar[k] })
export default dict
