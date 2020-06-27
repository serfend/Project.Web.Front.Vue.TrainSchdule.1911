import list from './modules/list'
import detail from './modules/detail'
import rules from './modules/rules'
import statistics from './modules/statistics'
const phyGrade = {
  path: 'phyGrade',
  component: () => import('@/views/blank'),
  name: 'MemberPhyGrade',
  meta: {
    title: 'default.app.phyGrade.title',
    icon: 'phy-grade'
  },
  children: [statistics, list, detail, rules]
}

export default phyGrade
