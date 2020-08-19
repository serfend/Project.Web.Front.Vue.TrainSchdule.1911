export function memberCardDefault() {
  return [{
    title: '京内新申请',
    description: '在当前日期范围内（见设置）休假地点在北京且已通过审批的申请数量',
    color: '#0f0',
    collection: 'new',
    filter: '{ console.log(i);value + i.to===11?i[card.binding]:0;console.log(i);return value }',
    binding: 'value'
  }, {
    title: '京内已完成',
    description: '在当前日期范围内（见设置）休假地点在北京且已通过审批并完成休假的申请数量',
    color: '#00f',
    collection: 'complete',
    filter: 'return value + i.to===11?i[card.binding]:0',
    binding: 'value'
  }, {
    title: '京外新申请',
    description: '在当前日期范围内（见设置）休假地点不在北京且已通过审批的申请数量',
    color: '#ff0',
    collection: 'new',
    filter: 'return value + i.to!==11?i[card.binding]:0',
    binding: 'value'
  }, {
    title: '京外已完成',
    description: '在当前日期范围内（见设置）休假地点不在北京且已通过审批并完成休假的申请数量',
    color: '#f0f',
    collection: 'complete',
    filter: 'return value + i.to!==11?i[card.binding]:0',
    binding: 'value'
  }, {
    title: '申请总天数',
    description: '在当前日期范围内（见设置）已通过审批申请的总天数',
    color: '#f00',
    collection: 'new',
    filter: null,
    binding: 'day'
  }, {
    title: '完成总天数',
    description: '在当前日期范围内（见设置）已通过审批并完成休假的申请的总天数',
    color: '#0ff',
    collection: 'complete',
    filter: null,
    binding: 'day'
  }]
}
