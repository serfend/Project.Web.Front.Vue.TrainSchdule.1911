import request from '../utils/request'

export function upload(filepath, filename, filedata, lastuploadId) {
  var fd = new FormData()
  fd.append('file', filedata)
  fd.append('filepath', filepath)
  fd.append('filename', filename)
  if (lastuploadId != null) {
    fd.append('resumeUploadId', lastuploadId)
  }
  return request.post('file/upload', fd, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 通过文件id下载
 *
 * @export
 * @param {*} fileid
 * @returns
 */
export function download(fileid) {
  return request.get('file/download', {
    params: {
      fileid
    }, 
    respondErrorIngore: true, 
    responseType: 'blob'
  })
}

/**
 *获取指定文件信息
 *
 * @export
 * @param {*} filepath
 * @param {*} filename
 * @returns
 */
export function requestFile(filepath, filename) {
  return request.get('file/load', {
    params: {
      filepath,
      filename
    }
  })
}

/**
 * 获取当前的文件下载/上传状态
 * 有效期30分钟
 * @export
 * @returns
 */
export function status() {
  return request.get('file/status')
}
