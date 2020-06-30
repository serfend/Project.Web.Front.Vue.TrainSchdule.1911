import {
  download,
  requestFile
} from '@/api/common/file'

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
    requestFile(path, fileName)
      .then(data => {
        if (data.file.isRemoved) {
          return rej(`文件:${path}/${fileName} 已于${data.file.removeDate}被移除`)
        }
        download(data.file.id).then(data => {
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
