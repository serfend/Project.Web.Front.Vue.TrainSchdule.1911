// TODO 动态加载
const get_length = x => {
  const v = x.vacation
  if (!v) return {}
  return { total: v.yearlyLength, left: v.leftLength }
}
// 返回 [总数,已完成]
const s_type_callback = {
  man: {
    name: '人',
    callback: (list, rate) => {
      return [
        list.length,
        list.filter(x => {
          const cur = get_length(x)
          return cur.total <= 0 || cur.left / cur.total <= 1 - rate
        }).length
      ]
    }
  },
  day: {
    name: '天',
    callback: list =>
      list.reduce(
        (prev, cur) => {
          cur = get_length(cur)
          prev[0] += cur.total
          prev[1] += (cur.total - cur.left)
          return prev
        },
        [0, 0]
      )
  }
}
const get_group_rate = (g_members, rate, s_type) => {
  const accomplishs = s_type_callback[s_type].callback(g_members, rate)
  return {
    rate: accomplishs[0] <= 0 ? 1 : accomplishs[1] / accomplishs[0],
    count: accomplishs[1],
    total: accomplishs[0]
  }
}
const to_percent = x => `${Math.floor(x * 1e4) / 1e2}%`
export const build_template = ({ rate, s_type }) => (
  members,
  g_members,
  name
) => {
  const title_rate =
    rate < 0 ? '完成' : rate === 1 ? '休满' : `完成${to_percent(rate)}`
  const title_type = s_type_callback[s_type].name
  const {
    rate: acc_rate,
    count: acc_count,
    total: acc_total
  } = get_group_rate(g_members, rate, s_type)
  const count_rate =
    members.length <= 0 ? 1 : g_members.length / members.length
  return {
    header: `${name}${title_type}数${title_rate}`,
    content: `${acc_count}/${acc_total}${title_type}\n${to_percent(
      acc_rate
    )}`,
    footer: `占比:${to_percent(count_rate)}`
  }
}
export const all_types = [
  { type: 'man', rate: 1 },
  { type: 'day', rate: -1 },
  { type: 'man', rate: 0.6 }
]
export default {
  build_template,
  all_types
}
