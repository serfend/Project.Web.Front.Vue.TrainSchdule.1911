export const default_pages = [
  {
    label: '注册账号',
    description: '注册和审批新账号窗口',
    svg: 'registernew',
    // icon: '/favicon.png',
    href: '/register/user'
  },
  {
    label: '我要休假',
    description: '个人提交休假申请窗口',
    svg: 'newapply',
    href: '/apply/vacation/newApply'
  },
  {
    label: '我的假期',
    description: '个人休假情况概览窗口',
    // icon: '/favicon.png',
    svg: 'people_fill',
    href: '/apply/vacation/myApply'
  },
  {
    label: '休假审批',
    description: '查询批假情况和审批单位休假窗口',
    // icon: '/favicon.png',
    svg: 'auditapply',
    href: '/apply/vacation/queryAndAuditApplies'
  },
  {
    label: '考核纪实',
    description: '查询周考月评、季度考评、专项考评、年度考评窗口',
    // icon: '/favicon.png',
    svg: 'phy-grade',
    href: '/memberRate/summary'
  },
  {
    label: '我要请假',
    description: '个人提交外出申请窗口',
    svg: 'newapply',
    href: '/apply/inday/newApply'
  },
  {
    label: '我的请假',
    description: '个人外出情况概览窗口',
    // icon: '/favicon.png',
    svg: 'people_fill',
    href: '/apply/inday/myApply'
  },
  {
    label: '请假审批',
    description: '查询批假情况和审批单位外出情况窗口',
    // icon: '/favicon.png',
    svg: 'auditapply',
    href: '/apply/inday/queryAndAuditApplies'
  },
  // {
  //   label: '统计信息',
  //   description: '各单位休假情况统计驾驶舱',
  //   // icon: '/favicon.png',
  //   svg: 'HTTPcuowushuai',
  //   href: '/dashboard',
  // },
]
