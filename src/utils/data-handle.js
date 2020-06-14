/**
 * 按目标字段进行分组
 *
 * @param {*} list
 * @param {*} name
 * @returns
 */
export function groupByFiled(list, name) {
  return list.reduce((obj, item) => {
    const key = item[name]
    if (!obj[key]) {
      obj[key] = []
      obj[key].push(item)
    } else {
      obj[key].push(item)
    }
    return obj
  }, {})
}

/**
 * 按目标方法分组
 *
 * @export
 * @param {*} list
 * @param {*} cb
 */
export function groupByPredict(list, cb) {
  return list.reduce((obj, item) => {
    const key = cb(item)
    if (!obj[key]) {
      obj[key] = []
      obj[key].push(item)
    } else {
      obj[key].push(item)
    }
    return obj
  }, {})
}

/**
 * 按回调返回值进行分组
 *
 * @param {*} array
 * @param {*} f
 * @returns
 */
export function groupByLamada(array, f) {
  var groups = {}
  array.forEach(function(o) {
    var group = JSON.stringify(f(o))
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return Object.keys(groups).map(function(group) {
    return groups[group]
  })
}

/**
 * edit setting (`prop` or `set`) and prevent setting from raise event of changed
 *
 * @export
 * @param {*} item setting item
 * @param {*} callback what wants to do
 * @param {*} freezingOffCallBack what wants to do while complete
 */
export function modify(item, callback, freezingOffCallBack) {
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
      if (freezingOffCallBack) freezingOffCallBack()
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
  const isStr = Object.prototype.toString.call(names) === '[object String]'
  if (names.length === 0) return node
  const q = names.splice(0, 1)
  if (directZoomIn && node[directZoomIn]) node = node[directZoomIn]
  const r = isStr ? node[names] : getProp(node[q[0]], names)
  if (directZoomIn && r && r[directZoomIn] !== undefined) return r[directZoomIn]
  return r
}
/**
 * compare i1 and i2,then put prop in i1 to i2's prop,and if there is prop `type` ,ignore it
 *
 * @param {Object} i1
 * @param {Object} i2
 */
export function pairSetting(i1, i2) {
  const k2 = Object.keys(i2).filter(i => i !== 'type')
  for (var i = 0; i < k2.length; i++) {
    const key = k2[i]
    const isObject = Object.prototype.toString.call(i2[key]) === '[object Object]'
    // 仅当两边皆对象，且原对象存在时才继续匹配
    if (isObject && i1[key]) {
      pairSetting(i1[key], i2[key])
    } else if (i2[key] !== null) {
      i1[key] = i2[key]
    }
  }
}
