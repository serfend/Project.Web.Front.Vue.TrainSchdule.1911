const steps = [
  {
    element: '#hamburger-container',
    popover: {
      title: '菜单按钮',
      description: '在此处选择一些功能',
      position: 'bottom'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: '多层级菜单',
      description: '可以通过此处快速的定位页面',
      position: 'bottom'
    }
  },
  {
    element: '#header-search',
    popover: {
      title: '搜索框',
      description: '通过此处搜索可能的功能',
      position: 'left'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: '全屏',
      description: '将会切换全屏模式',
      position: 'left'
    }
  },
  {
    element: '#size-select',
    popover: {
      title: '系统尺寸',
      description: 'Switch the system size',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: '多个标签',
      description: '快速切换到你已经访问过的标签',
      position: 'bottom'
    },
    padding: 0
  }
]

export default steps
