import request from '@/utils/request'

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
  var opt = {
    params: {
      fileid
    }
  }
  return request.get('file/download', opt)
}

/**
 * 获取文件夹下的文件列表
 *
 * @export
 * @param {*} filepath
 * @param {*} pages
 * @returns
 */
export function folderFiles(path, pages) {
  return request.get('file/folderFiles', {
    params: {
      path,
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize
    }
  })
}

/**
 * 获取子文件夹
 *
 * @export
 * @param {*} path
 * @param {*} pages
 * @returns
 */
export function requestFolder(path, pages) {
  return request.get('file/folders', {
    params: {
      path,
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize
    }
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
 * 通过路径下载文件
 *
 * @export
 * @param {*} path
 * @param {*} filename
 * @returns
 */
export function downloadByPath(path, filename, ignoreError) {
  return request.get('file/frompath', {
    params: {
      path,
      filename
    },
    ignoreError
  })
}

/**
 * 删除指定文件
 *
 * @export
 * @param {*} filepath
 * @param {*} filename
 * @param {*} clientKey
 * @returns
 */
export function deleteFile(filepath, filename, clientKey) {
  return request.delete('file/remove', {
    params: {
      path: filepath,
      filename,
      clientKey
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

/**
 * 获取上传码
 *
 * @export
 * @param {*} id 文件id
 * @param {*} auth 授权码
 */
export function getClientKey(id, auth) {
  return request.post('/file/clientKey', {
    id,
    auth
  })
}
