
const qrCodeRouter =
{
  path: 'qrCode',
  component: () => import('@/views/common/QrCodeScan/index'),
  name: 'QrCode',
  meta: {
    title: 'default.utils.qrCode.title',
    icon: 'QRcode'
  }
}

export default qrCodeRouter
