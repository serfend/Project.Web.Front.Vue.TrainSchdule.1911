import {
  getUserCompany
} from '@/api/user/userinfo'

/**
 * edit setting (`prop` or `set`) and prevent setting from raise event of changed
 *
 * @export
 * @param {*} item setting item
 * @param {*} callback what wants to do
 */
export function modify(item, callback) {
  if (!item) return
  if (!item.__setting) {
    item.__setting = {
      freezing: true
    }
  } else item.__setting.freezing = true
  setTimeout(() => {
    callback(item)
    setTimeout(() => {
      item.__setting.freezing = false
    }, 1000)
  }, 50)
}

/**
 * get property of object
 *
 * @export
 * @param {Object} node
 * @param {String,Array} names
 * @param {String} directZoomIn if find result has this prop,directly zoom in
 * @returns if property not exist or is `null`,it would return null
 */
export function getProp(node, names, directZoomIn = 'value') {
  if (!node) return null
  var isStr = Object.prototype.toString.call(names) === '[object String]'
  if (names.length === 0) return node
  var q = names.splice(0, 1)
  var r = isStr ? node[names] : getProp(node[q[0]], names)
  if (directZoomIn && r && r[directZoomIn]) return r[directZoomIn]
}

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
  },
  memberType: {
    value: null,
    label: '人员类别',
    type: () => import('@/components/Selector'),
    __setting: {
      props: {
        option: [{
          label: '1',
          value: '1'
        }, {
          label: '2',
          value: '2'
        }]
      }
    }
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
