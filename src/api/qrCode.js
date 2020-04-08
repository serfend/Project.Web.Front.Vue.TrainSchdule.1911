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
  }, { respondErrorIngore: true })
}
