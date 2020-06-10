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
 * you can use `getProp(obj,['a','b','c'])` to get obj.a.b.c,simply?
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
  if (directZoomIn && node[directZoomIn]) node = node[directZoomIn]
  var r = isStr ? node[names] : getProp(node[q[0]], names)
  if (directZoomIn && r && r[directZoomIn]) return r[directZoomIn]
  return r
}

export function saveSetting(name, setting) {
  localStorage.setItem(`dashboard.setting[${name}]`, JSON.stringify(setting))
}
export function loadSetting(name) {
  var rawSetting = localStorage.getItem(`dashboard.setting[${name}]`)
  if (rawSetting) {
    var s = JSON.parse(rawSetting)
    var newSetting = createSetting()
    pairSetting(newSetting, s)
    console.log('setting is load:', name, newSetting)
    setting = newSetting
  } else {
    console.log('setting not exist:', name)
  }
}

/**
 * compare i1 and i2,then put prop in i1 to i2's prop,and if there is prop `type` ,ignore it
 *
 * @param {Object} i1
 * @param {Object} i2
 */
function pairSetting(i1, i2) {
  var k2 = Object.keys(i2).filter(i => i !== 'type')
  for (var i = 0; i < k2.length; i++) {
    var key = k2[i]
    var isObject = Object.prototype.toString.call(i2[key]) === '[object Object]'
    // 仅当两边皆对象，且原对象存在时才继续匹配
    if (isObject && i1[key]) {
      pairSetting(i1[key], i2[key])
    } else if (i2[key] !== null) {
      i1[key] = i2[key]
    }
  }
}
export function createSetting() {
  return {
    color: {
      __setting: {
        default: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'], // 父设置
        type: () => import('@/components/ColorsPicker')
      },
      value: {
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
      value: {
        main: {
          value: null,
          label: '主单位',
          type: () => import('@/components/Company/CompanySelector')
        },
        compare: {
          value: [],
          label: '比较单位',
          type: () => import('@/components/Company/CompaniesSelector')
        }
      },
      label: '单位'
    },
    memberType: {
      value: null,
      label: '人员类别',
      type: () => import('@/components/Selector'),
      __setting: {
        props: {
          option: []
        }
      }
    },
    // 统计地域
    adminDivision: {
      label: '地域区划',
      value: '施工中,用于设置定义京内京外',
      type: 'el-input'
    }
  }
}
var innerSetting = createSetting()
export var setting = innerSetting
