import Layout from '@/layout'

import log from './modules/log'
import file from './modules/file'
import qr_code from './modules/qrCode'
import dwz from './modules/dwz'
import manage from './modules/manager'
import comment from '../others/comment'
import version from './modules/version'

const system = {
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: 'default.system.title',
    icon: 'setting'
  },
  children: [
    manage, log,
    {
      path: 'iframePage',
      component: () => import('@/components/IFramePage'),
      name: 'IFramePage',
      hidden: true,
      meta: {
        breadcrumb: false,
        affix: false,
        title: 'default.app.iframepage.title',
        icon: 'component'
      }
    }, version, file, dwz, qr_code, comment]
}

export default system
