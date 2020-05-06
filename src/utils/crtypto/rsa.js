import JsEncrypt from 'jsencrypt'
const rsaPublicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCz3lBSqu05sK6r3SDCr2z0lT19j4LBbWbapEvv37paxbwmkvA5E/nr/VD9Hw2jueBt9NyEdnzWEgN+WmRF1GUYBQFL6YWneFkovgpLA8tgXHEojePAMfgMb+hoYHoV90MUQwANDbt0gg4nnlRxZB+WtZc5CUQT5x7ckCs5+iQNTwIDAQAB-----END PUBLIC KEY-----'
function encrypt(raw) {
  const jse = new JsEncrypt()
  jse.setPublicKey(rsaPublicKey)
  const password = jse.encrypt(raw)
  return password
}
function decrypt(raw) {
  const jse = new JsEncrypt()
  jse.setPublicKey(rsaPublicKey)
  return jse.decrypt(raw)
}
export default {
  encrypt,
  decrypt
}
