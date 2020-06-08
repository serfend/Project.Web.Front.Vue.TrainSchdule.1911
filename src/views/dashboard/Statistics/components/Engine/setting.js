import {
  getUserCompany
} from '@/api/user/userinfo'

export var setting = {
  color: {
    value: {
      __setting: {
        default: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'], // 父设置
        type: () => import('@/components/ColorsPicker')
      },
      memberCard: {
        value: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'], // 子设置
        label: '用户卡片',
        type: () => import('@/components/ColorsPicker'),
        __setting: {
          useParent: true // 是否继承父设置
        }
      },
      barChart: {
        value: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'],
        label: '主图',
        type: () => import('@/components/ColorsPicker'),
        __setting: {
          useParent: true // 是否继承父设置
        }
      }
    },
    label: '配色'
  },
  dateRange: {
    value: {
      start: {
        value: new Date(new Date() - 7 * 86400000),
        label: '开始时间',
        type: 'el-date-picker'
      },
      end: {
        value: new Date(),
        label: '结束时间',
        type: 'el-date-picker'
      }
    },
    label: '统计时间'
  },
  company: {
    value: null,
    label: '单位',
    type: () => import('@/components/Company/CompanySelector')
  }
}
setTimeout(() => {
  getUserCompany(null).then(data => {
    setting.company.value = data.company
  }).catch(e => {
    if (e.status === 12120) {
      setTimeout(() => {
        location.href = '/'
      }, 2000)
    }
  })
}, 2000)
