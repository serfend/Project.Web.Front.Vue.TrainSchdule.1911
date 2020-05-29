var dict = {
  default: {
    language: {
      en: 'English',
      ch: '中文'
    },
    system: {
      title: '高级',
      clipboard: {
        success: '复制成功',
        fail: '复制失败'
      }
    },
    app: {
      title: '应用',
      log: {
        title: '日志'
      },
      file: {
        title: '文件'
      },
      dwz: {
        title: '短网址'
      },
      manager: {
        title: '后台管理'
      },
      iframepage: {
        title: '页面'
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
    audit: '休假审批',
    detail: '休假申请详情',
    my: '我的假期',
    setting: {
      title: '设置选项',
      application: {
        title: '休假申请',
        auditStream: '审批流',
        exportXls: 'Excel模板'
      },
      users: {
        title: '用户管理',
        social: '家庭情况',
        company: '单位情况'
      }
    }
  },
  navbar: {
    dashboard: '统计',
    logOut: '退出登录',
    profile: '个人信息',
    welcome: '首页'
  },
  register: {
    title: '注册',
    new: '注册新号',
    checkemail: '认证邮箱',
    audit: '审核注册'
  },
  login: {
    title: '登录',
    defaultTitle: '登录',
    username: '用户名',
    password: '密码'
  },
  profile: {
    activity: '@',
    timeline: '动态',
    account: '我的'
  },
  comments: {
    title: '资讯',
    notice: {
      title: '通知'
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
Object.keys(dict.navbar).forEach((k) => {
  dict.route[k] = dict.navbar[k]
})
export default dict
