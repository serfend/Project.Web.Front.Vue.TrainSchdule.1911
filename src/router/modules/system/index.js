import Layout from '@/layout'

import logRouter from './modules/log'
import fileRouter from './modules/file'
import qrCodeRouter from './modules/qrCode'
import dwzRouter from './modules/dwz'
import managerRouter from './modules/manager'
import commentRouter from '../comment'

const systemRouter = {
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: 'default.system.title',
    icon: 'setting'
  },
  children: [{
    path: 'app',
    component: () => import('@/views/blank'),
    meta: {
      title: 'default.app.title',
      icon: 'component'
    },
    children: [managerRouter, logRouter,
      {
        path: 'iframePage',
        component: () => import('@/components/IFramePage'),
        name: 'IFramePage',
        hidden: true,
        meta: {
          breadcrumb: false,
          affix: false,
          title: 'default.app.iframepage.title'
        }
      }

    ]
  }, {
    path: 'utils',
    component: () => import('@/views/blank'),
    meta: {
      title: 'default.utils.title',
      icon: 'tree-table'
    },
    children: [fileRouter, dwzRouter, qrCodeRouter]
  }, commentRouter]
}

export default systemRouter
