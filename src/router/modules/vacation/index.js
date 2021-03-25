import vacation from './vacation'
import inday from './inday'
import AuditStream from './AuditStream'
const applicationRouter = {
  path: '/apply',
  component: () => import('@/layout'),
  redirect: 'noRedirect',
  name: 'vacation',
  meta: {
    ctitle: '请休假',
    icon: 'clipboard'
  },
  children: [vacation, inday, AuditStream]
}
export default applicationRouter
