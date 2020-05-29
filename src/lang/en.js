var dict = {
  default: {
    language: {
      en: 'English',
      ch: '中文'
    },
    system: {
      title: 'system',
      clipboard: {
        success: '复制成功',
        fail: '复制失败'
      }
    },
    app: {
      title: 'application',
      log: {
        title: 'log'
      },
      file: {
        title: 'file'
      },
      dwz: {
        title: 'shortUrl'
      },
      manager: {
        title: 'manager'
      },
      iframepage: {
        title: 'page'
      }
    },
    utils: {
      title: 'tool',
      qrCode: {
        title: 'qrCode',
        Create: {
          title: 'generate'
        },
        Scan: {
          title: 'scan'
        }
      }
    }
  },
  application: {
    title: 'vacation manage',
    new: 'wanna a vacation',
    audit: 'audit sb/s vacation',
    detail: 'detail of apply',
    my: 'mine vacation',
    setting: {
      title: 'setting options',
      application: {
        title: 'vacation apply',
        auditStream: 'audit stream',
        exportXls: 'export Excel model'
      },
      users: {
        title: 'manage users',
        social: 'social',
        company: 'company'
      }
    }
  },
  navbar: {
    dashboard: 'statistics',
    logOut: 'logout',
    profile: 'profile',
    welcome: 'homepage'
  },
  register: {
    title: 'register',
    new: 'register',
    checkemail: 'confirm email',
    audit: 'audit account'
  },
  login: {
    title: 'login',
    defaultTitle: 'login',
    username: 'username',
    password: 'password'
  },
  profile: {
    activity: '@',
    timeline: 'timeline',
    account: 'mine'
  },
  comments: {
    title: 'message',
    notice: {
      title: 'notice'
    },
    bbs: {
      title: 'bbs'
    }
  },
  settings: {
    title: 'setting options',
    fixedHeader: 'fixed header',
    tagsView: 'tagsView',
    theme: 'theme',
    refresh: 'refresh',
    close: 'close',
    closeAll: 'close all',
    closeOthers: 'close others',
    sidebarLogo: 'sidebar logo'
  },
  errorLog: {
    title: 'error log'
  }
}
dict.tagsView = dict.settings
dict.route = dict
Object.keys(dict.navbar).forEach((k) => {
  dict.route[k] = dict.navbar[k]
})
export default dict
