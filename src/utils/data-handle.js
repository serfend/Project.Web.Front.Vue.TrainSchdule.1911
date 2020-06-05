/**
 * 按目标字段进行分组
 *
 * @param {*} list
 * @param {*} name
 * @returns
 */
export function groupByFiled(list, name) {
  return list.reduce((obj, item) => {
    if (!obj[item[name]]) {
      obj[item[name]] = []
      obj[item[name]].push(item)
    } else {
      obj[item[name]].push(item)
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
