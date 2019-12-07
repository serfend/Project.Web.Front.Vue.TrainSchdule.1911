export function getLocationChildrenIndexByValue(item, value) {
  for (var i = 0; i < item.children.length; i++) {
    if (item.children[i].value === value) return i
  }
  return 0
}

/**
 * 多级级联查询
 * TODO后续可做为组件
 * @export
 * @param {Array} finalOption 默认显示
 * @param {Array} val 新的用户选值
 * @param {queryItem} targetItem 最终传出值
 * @param {function} getChildMethod 获取子层级内容的回调
 */
export function updateSelect(finalOption, val, targetItem, getChildMethod) {
  if (val) {
    const deep = val.length - 1
    const id = val[deep]
    targetItem.value = id
    console.log("finnal opt select to " + id)
    getChildMethod(id).then(data => {
      const children = data.list.map(d => ({
        label: d.name,
        value: d.code,
        children: []
      }))
      var item = finalOption[0]
      var nextIndex = 0
      for (var i = 0; i < deep; i++) {
        nextIndex = getLocationChildrenIndexByValue(item, val[i + 1])
        item = item.children[nextIndex]
      }
      item.children = children
      if (item.children.length === 0) {
        item.children[0] = {
          label: '无下一层级',
          disabled: true
        }
      }
    })
  } else {
    this.$message.error('无效的单位')
  }
}

