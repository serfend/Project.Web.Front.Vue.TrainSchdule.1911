
const qrCodeRouter =
{
  path: '/utils/qrCode',
  component: () => import('@/views/common/QrCodeScan/index'),
  name: 'QrCode',
  meta: {
    title: 'default.utils.qrCode.title',
    icon: 'component'
  }
}

export default qrCodeRouter
