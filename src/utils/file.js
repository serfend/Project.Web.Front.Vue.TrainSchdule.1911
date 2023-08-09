import { download, requestFile } from '@/api/common/file'
import { isString, isArray, isObject, strIsDatetime } from '@/utils/validate'
/**
 * 获取指定文档
 *
 * @export
 * @param {String} path
 * @param {String} fileName
 * @returns
 */
export function loadDocument(path, fileName) {
  return new Promise((res, rej) => {
    requestFile({ filePath: path, fileName })
      .then(data => {
        const f = data.file || data.model
        if (f.isRemoved) {
          return rej(`文件:${path}/${fileName} 已于${f.removeDate}被移除`)
        }
        download(f.id).then(data => {
          var reader = new FileReader()
          reader.onload = function(event) {
            var content = reader.result
            res(content)
          }
          // it seem sometimes occur that data is just simply `string`
          if (typeof data === 'string') {
            res(data)
          } else {
            reader.readAsText(data)
          }
        })
      })
      .catch(e => {
        rej(`读取${path}/${fileName}异常:${e.message}`)
      })
  })
}
export function fileToBase64(data, fileType) {
  return new Promise((res, rej) => {
    var reader = new FileReader()
    reader.onload = function(evt) {
      res(evt.target.result)
    }
    reader.onerror = function(evt) {
      rej(evt)
    }
    if (!fileType) fileType = 'image/jpg'
    var blob = new Blob([data], {
      type: fileType
    })
    reader.readAsDataURL(blob)
  })
}
export function base64ToBlob(content) {
  const raw = window.atob(content)
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: 'arraybuffer' })
}

export function downloadBlob(data, filename) {
  filename = filename || `data${Math.round(Math.random() * 1e6)}.dat`
  const url = window.URL.createObjectURL(
    new Blob([data], { type: 'arraybuffer' })
  )
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 导出xlsx的blob
 *
 * @export
 * @param {*} data blob数据（xlsx模板）
 * @param {*} model 模型
 * @param {*} option generate option
 */
export function exportXlsByTemplate(data, model, option) {
  const XlsxTemplate = require('xlsx-template')
  const template = new XlsxTemplate(data)
  // template.sheets.forEach((i, index) => {
  //   template.substitute(index + 1, model)
  // })
  model = handle_all_value(model)
  console.log('xlsx model', model)
  template.substituteAll(model)
  option = option || { type: 'uint8array' }
  return template.generate(option)
}
function check_string_format (raw) {
  if (!strIsDatetime(raw)) return raw
  return new Date(Date.parse(raw))
}

/**
 * check value format and parse it
 *
 * @param {*} root
 * @param {*} data
 * @return {*}
 */
function handle_all_value (data) {
  const root = {}
  const paths = ['_']
  const result = __handle_all_value({ root, data, paths })
  return Object.assign(result, root)
}

function __handle_all_value ({ root, data, paths, index }) {
  if (isString(data)) return check_string_format(data)

  if (isArray(data)) {
    data = data.map((x, index) => {
      paths.push(index)
      const r = __handle_all_value({ root, data: x, paths, index })
      paths.pop()
      return r
    })
    const current_path = paths.join('_')
    root[current_path] = data // cache list-item to root
    return data
  }

  if (isObject(data)) {
    const tmp = {
      __index: (index || 0) + 1 // mark item-index
    }
    Object.keys(data).map(key => {
      paths.push(key)
      tmp[key] = __handle_all_value({ root, data: data[key], paths })
      paths.pop()
    })
    return tmp
  }

  return data
}
