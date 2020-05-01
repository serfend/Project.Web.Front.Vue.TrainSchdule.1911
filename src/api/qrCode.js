import request from '../utils/request'

/**
 * 生成二维码
 *
 * @export
 * @param {String} text 生成
 */
export function qrCodeEncode(text) {
  return request.post('/static/qrCodeGenerate', {
    data: text
  })
}

/**
 * qr
 *
 * @export
 * @param {String} img base64string
 * @returns
 */
export function qrCodeScan(img) {
  return request.post('/static/qrCodeScan', {
    img
  })
}
